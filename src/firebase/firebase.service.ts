import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist';
import * as firebase from 'firebase-admin';
var serviceAccount = require('../../notification-ab09a-firebase-adminsdk-zkoxr-d2483891d6.json');
import { BatchResponse } from 'firebase-admin/lib/messaging/messaging-api';
import * as shell from 'shelljs';
import { chunk } from 'lodash';
import { mapLimit } from 'async';

export interface ISendFirebaseMessages {
  token: string;
  title?: string;
  message: string;
}

@Injectable()
export class FirebaseService {
  constructor(private service: ConfigService) {
    // For simplicity these credentials are just stored in the environment
    // However these should be stored in a key management system

    firebase.initializeApp({
      credential: firebase.credential.cert(serviceAccount),
      databaseURL: '',
    });
  }

  public async sendFirebaseMessages(
    firebaseMessages: ISendFirebaseMessages[],
    dryRun?: boolean,
  ): Promise<BatchResponse> {
    //join every "Number" in one array
    const batchedFirebaseMessages = chunk(firebaseMessages, 500);

    //manage how many parallel async will allow in same time
    const batchResponses = await mapLimit<
      ISendFirebaseMessages[],
      BatchResponse
    >(
      batchedFirebaseMessages,
      process.env.FIREBASE_PARALLEL_LIMIT, // 3 is a good place to start
      async (
        groupedFirebaseMessages: ISendFirebaseMessages[],
      ): Promise<BatchResponse> => {
        try {
          const tokenMessages: firebase.messaging.TokenMessage[] =
            groupedFirebaseMessages.map(({ message, title, token }) => ({
              notification: { body: message, title },
              token,
              apns: {
                payload: {
                  aps: {
                    'content-available': 1,
                  },
                },
              },
            }));

          return await this.sendAll(tokenMessages, dryRun);
        } catch (error) {
          return {
            responses: groupedFirebaseMessages.map(() => ({
              success: false,
              error,
            })),
            successCount: 0,
            failureCount: groupedFirebaseMessages.length,
          };
        }
      },
      //  git@github.com:the3rafas/twitter-BackEnd-Gql.git
      // 
    );
    // 

    // git push -u origin main
    return batchResponses.reduce(
      ({ responses, successCount, failureCount }, currentResponse) => {
        return {
          responses: responses.concat(currentResponse.responses),
          successCount: successCount + currentResponse.successCount,
          failureCount: failureCount + currentResponse.failureCount,
        };
      },
      {
        responses: [],
        successCount: 0,
        failureCount: 0,
      } as unknown as BatchResponse,
    );
  }

  public async sendAll(
    messages: firebase.messaging.TokenMessage[],
    dryRun?: boolean,
  ) {
    for (const { notification, token } of messages) {
      shell.exec(
        `echo '{ "aps": { "alert": ${JSON.stringify(
          notification,
        )}, "token": "${token}" } }' | xcrun simctl push booted com.company.appname -`,
      );
    }
    return firebase.messaging().sendAll(messages, dryRun);
  }
}

import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { FirebaseService } from './firebase/firebase.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private notif: FirebaseService,
  ) {}

  @Get()
  async getHello() {
    return await this.notif.sendFirebaseMessages([
      {
        message: 'hola hesham',
        token:
          ' fuEBBgW7sQGDexRmHtVTod:APA91bHuPpSRHMN571cGrZnmC4D568YN-kMjBbPbJZp6EXxT739C5Nl1VSNGpiKXFjmy0nKq7cwjFnml7bz2qvfIWvbGobadg30bLZJ-h61ayKQ5X_2itAjiXWLjkKxhjnIWQ-gmnatQ',
        title: 'from team baianat',
      },
      {
        message: 'hola omar',
        token:
          ' fuEBBgW7sQGDexRmHtVTod:APA91bHuPpSRHMN571cGrZnmC4D568YN-kMjBbPbJZp6EXxT739C5Nl1VSNGpiKXFjmy0nKq7cwjFnml7bz2qvfIWvbGobadg30bLZJ-h61ayKQ5X_2itAjiXWLjkKxhjnIWQ-gmnatQ',
        title: 'from team baianat',
      },
      {
        message: 'hola diaa',
        token:
          ' fuEBBgW7sQGDexRmHtVTod:APA91bHuPpSRHMN571cGrZnmC4D568YN-kMjBbPbJZp6EXxT739C5Nl1VSNGpiKXFjmy0nKq7cwjFnml7bz2qvfIWvbGobadg30bLZJ-h61ayKQ5X_2itAjiXWLjkKxhjnIWQ-gmnatQ',
        title: 'from team baianat',
      },
      {
        message: 'hola abdo',
        token:
          ' fuEBBgW7sQGDexRmHtVTod:APA91bHuPpSRHMN571cGrZnmC4D568YN-kMjBbPbJZp6EXxT739C5Nl1VSNGpiKXFjmy0nKq7cwjFnml7bz2qvfIWvbGobadg30bLZJ-h61ayKQ5X_2itAjiXWLjkKxhjnIWQ-gmnatQ',
        title: 'from team baianat',
      },
    ]);
  }
}

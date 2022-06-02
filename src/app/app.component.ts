import { Component, ChangeDetectorRef} from '@angular/core';
import { onAuthUIStateChange, CognitoUserInterface, AuthState } from '@aws-amplify/ui-components';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'Probate Review';
  user: CognitoUserInterface | undefined;
  authState!: AuthState;

  constructor(private ref: ChangeDetectorRef) {}
  
  ngOnInit() {
    onAuthUIStateChange((authState, authData) => {
      this.authState = authState;
      this.user = authData as CognitoUserInterface;
      this.ref.detectChanges();
    })
  }
  
  ngOnDestroy() {
    return onAuthUIStateChange;
  }
}

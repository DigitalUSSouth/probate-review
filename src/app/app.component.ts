import { Component, ChangeDetectorRef} from '@angular/core';
import { Router } from '@angular/router';
// import { onAuthUIStateChange, CognitoUserInterface, AuthState } from '@aws-amplify'; // -components
// import { onAuthUIStateChange, CognitoUserInterface, AuthState } from '@aws-amplify/ui-components';
import { Store } from '@ngrx/store';
import { initializeAppState } from 'src/state/app.actions';
import { Amplify } from 'aws-amplify';
import { AuthenticatorService } from '@aws-amplify/ui-angular';
import { AmplifyUser } from '@aws-amplify/ui';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'Probate Review';
  user: AmplifyUser | undefined;
  // authState!: AuthState;

  constructor(private ref: ChangeDetectorRef, private router: Router, private store: Store, public authenticator: AuthenticatorService) {
    this.store.dispatch(initializeAppState());
    this.user = authenticator.user
  }
  
  ngOnInit() {
    // onAuthUIStateChange((authState, authData) => {
    //   this.authState = authState;
    //   this.user = authData as CognitoUserInterface;
    //   this.ref.detectChanges();
    // })
  }
  
  // ngOnDestroy() {
  //   return onAuthUIStateChange;
  // }

  navigate(url: string) {
    this.router.navigateByUrl(url);
  }
}

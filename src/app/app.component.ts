import { Component, ChangeDetectorRef} from '@angular/core';
import { Router } from '@angular/router';
// import { onAuthUIStateChange, CognitoUserInterface, AuthState } from '@aws-amplify/ui'; // -components
import { onAuthUIStateChange, CognitoUserInterface, AuthState } from '@aws-amplify/ui-components';
import { Store } from '@ngrx/store';
import { initializeAppState } from 'src/state/app.actions';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'Probate Review';
  user: CognitoUserInterface | undefined;
  authState!: AuthState;

  constructor(private ref: ChangeDetectorRef, private router: Router, private store: Store) {
    this.store.dispatch(initializeAppState());
  }
  
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

  navigate(url: string) {
    this.router.navigateByUrl(url);
  }
}

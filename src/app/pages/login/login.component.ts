import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { ionLogoGoogle } from '@ng-icons/ionicons';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { environment } from '../../../environments/environment';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Router, RouterModule } from '@angular/router';
import { ILogin } from './models/login.interface';
import { LoginService } from './services/login.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subscription, switchMap } from 'rxjs';
import { AuthService } from '../../shared/services/auth.service';
import { UserDataService } from '../../shared/services/user-data.service';

@Component({
  selector: 'app-login',
  imports: [
    NzGridModule,
    NzButtonModule,
    NgIcon,
    NzCardModule,
    NzFormModule,
    NzInputModule,
    FormsModule,
    ReactiveFormsModule,
    NzIconModule,
    RouterModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  viewProviders: [provideIcons({ ionLogoGoogle })],
})
export class LoginComponent implements OnInit, OnDestroy {
  public form: FormGroup = <FormGroup>{};
  public passwordType = signal('password');
  public isLoading = signal(false);

  private loginService = inject(LoginService);
  private router = inject(Router);
  private messageService = inject(NzMessageService);
  private authService = inject(AuthService);
  private userDataService = inject(UserDataService);
  private subscriptions = new Subscription();

  public ngOnInit(): void {
    this.buildForm();
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public loginWithGoogle(): void {
    window.location.href = `${environment.apiUrl}/auth/google`;
  }

  public submitForm(): void {
    if (this.form.valid) {
      this.login();
    } else {
      this.validateFields();
    }
  }

  public togglePassword(): void {
    if (this.passwordType() === 'password') {
      this.passwordType.set('text');
    } else {
      this.passwordType.set('password');
    }
  }

  private validateFields(): void {
    Object.values(this.form.controls).forEach((control) => {
      if (control.invalid) {
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
      }
    });
  }

  private buildForm(): void {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  private login(): void {
    const payload: ILogin = {
      email: this.form.get('email')!.value,
      password: this.form.get('password')!.value,
    };

    this.isLoading.set(true);
    this.subscriptions.add(
      this.loginService
        .login(payload)
        .pipe(
          switchMap((response) => {
            this.authService.setToken(response.access_token);
            this.userDataService.setUserId(response.userId);

            return this.userDataService.fetchUserData(
              response.access_token ?? ''
            );
          })
        )
        .subscribe({
          next: (response) => {
            this.userDataService.setUserData(response);
            this.router.navigateByUrl('/');
          },
          error: (error) => {
            console.error('Erro ao buscar dados do usuário:', error);
            this.messageService.error(error.error.message);
            this.authService.logout();
          },
        })
        // .subscribe({
        //   next: (response) => {
        //     this.router.navigateByUrl('/');
        //   },
        //   error: (error) => {
        //     console.log('erro no login', error);
        //     this.messageService.error(error.error.message);
        //   },
        // })
        .add(() => {
          this.isLoading.set(false);
        })
    );
  }
}

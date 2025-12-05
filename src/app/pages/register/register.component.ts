import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { RegisterService } from './services/register.service';
import { IRegister } from './models/register.interface';
import { Subscription } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-register',
  imports: [
    NzGridModule,
    NzButtonModule,
    NzCardModule,
    NzFormModule,
    NzInputModule,
    FormsModule,
    ReactiveFormsModule,
    NzIconModule,
    RouterModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit, OnDestroy {
  public form: FormGroup = <FormGroup>{};
  public passwordType = signal('password');
  public confirmPasswordType = signal('password');
  public isLoading = signal(false);

  private registerService = inject(RegisterService);
  private router = inject(Router);
  private messageService = inject(NzMessageService);
  private subscriptions = new Subscription();

  public ngOnInit(): void {
    this.buildForm();

    this.form.get('password')?.valueChanges.subscribe(() => {
      this.form.get('confirmPassword')?.updateValueAndValidity();
    });
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public submitForm(): void {
    if (this.form.valid) {
      this.register();
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

  public toggleConfirmPassword(): void {
    if (this.confirmPasswordType() === 'password') {
      this.confirmPasswordType.set('text');
    } else {
      this.confirmPasswordType.set('password');
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
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [this.confirmValidator]),
    });
  }

  private confirmValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return { error: true, required: true };
    }
    // Acesse o valor do campo password via parent
    const parent = control.parent as FormGroup;
    if (parent) {
      const password = parent.get('password')?.value;
      if (control.value !== password) {
        return { confirm: true, error: true };
      }
    }
    return null;
  }

  private register(): void {
    const payload: IRegister = {
      email: this.form.get('email')!.value,
      password: this.form.get('password')!.value,
    };

    this.isLoading.set(true);
    this.subscriptions.add(
      this.registerService
        .register(payload)
        .subscribe({
          next: (response) => {
            this.messageService.success(response.data.message);
            this.router.navigateByUrl('/login');
          },
          error: (error) => {
            console.log('erro no cadastro', error);
            this.messageService.error(error.error.message);
          },
        })
        .add(() => {
          this.isLoading.set(false);
        })
    );
  }
}

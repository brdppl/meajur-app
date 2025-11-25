import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../shared/services/auth.service';
import { UserDataService } from '../../../../shared/services/user-data.service';

@Component({
  selector: 'app-login-success',
  imports: [],
  templateUrl: './success.component.html',
  styleUrl: './success.component.scss',
})
export class SuccessComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private userDataService = inject(UserDataService);

  public ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const token = params['token'];
      const userId = params['userId'];

      if (token) {
        this.authService.setToken(token);
        this.userDataService.setUserId(userId);

        this.userDataService.fetchUserData(token).subscribe({
          next: (userData) => {
            this.userDataService.setUserData(userData);
            this.router.navigateByUrl('/');
          },
          error: (err) => {
            console.error('Erro ao buscar dados do usuário:', err);
            this.authService.clearToken();
            this.userDataService.clearUserId();
            this.router.navigateByUrl('/login');
          },
        });
      }
    });
  }
}

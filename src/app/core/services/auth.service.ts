import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';
import { environment } from '@env/environment';
import { User, UserRole } from '@core/interfaces/user.interface';
import { AlertService } from '@core/services/alert.service';

interface LoginRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface LoginResponse {
  user: User;
  success: boolean;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isAuthenticated = new BehaviorSubject<boolean>(false);
  
  constructor(
    private http: HttpClient,
    private alertService: AlertService
  ) {
    this.checkAuthentication();
  }

  login(email: string, password: string, rememberMe: boolean): Observable<LoginResponse> {
    const loginData: LoginRequest = {
      email,
      password,
      rememberMe
    };

    return this.http.post<LoginResponse>(
      `${environment.apiUrl}/auth/login`, 
      loginData,
      {
        withCredentials: true, // Importante para permitir cookies
        observe: 'response' as const
      }
    ).pipe(
      map((response: HttpResponse<LoginResponse>) => {
        if (response.body) {
          this.currentUserSubject.next(response.body.user);
          this.isAuthenticated.next(true);
          this.alertService.success('¡Bienvenido al Sistema VIP!', 'Inicio de Sesión');
          return response.body;
        }
        throw new Error('Respuesta inválida del servidor');
      })
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(
      `${environment.apiUrl}/auth/logout`,
      {},
      { withCredentials: true }
    ).pipe(
      tap(() => {
        this.currentUserSubject.next(null);
        this.isAuthenticated.next(false);
      })
    );
  }

  private checkAuthentication(): void {
    // Verificar el estado de autenticación con el backend
    this.http.get<User>(
      `${environment.apiUrl}/auth/check`,
      { withCredentials: true }
    ).subscribe({
      next: (user) => {
        this.currentUserSubject.next(user);
        this.isAuthenticated.next(true);
      },
      error: () => {
        this.currentUserSubject.next(null);
        this.isAuthenticated.next(false);
      }
    });
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  isAuthenticated$(): Observable<boolean> {
    return this.isAuthenticated.asObservable();
  }

  hasRole(role: UserRole): Observable<boolean> {
    return this.currentUserSubject.pipe(
      map(user => user?.role === role)
    );
  }

  hasAnyRole(roles: UserRole[]): Observable<boolean> {
    return this.currentUserSubject.pipe(
      map(user => user ? roles.includes(user.role) : false)
    );
  }

  getCurrentUserRole(): Observable<UserRole | null> {
    return this.currentUserSubject.pipe(
      map(user => user?.role || null)
    );
  }

  isSuperAdmin(): Observable<boolean> {
    return this.hasRole(UserRole.SUPER_ADMIN);
  }

  isAdmin(): Observable<boolean> {
    return this.hasAnyRole([UserRole.SUPER_ADMIN, UserRole.ADMIN]);
  }

  isPresentador(): Observable<boolean> {
    return this.hasRole(UserRole.PRESENTADOR);
  }
}
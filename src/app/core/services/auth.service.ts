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
      `${environment.apiUrl}/Auth/login`,
      loginData,
      {
          withCredentials: true,
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
          },
          observe: 'response' as const
      }
  ).pipe(
      map((response: HttpResponse<LoginResponse>) => {
          if (response.body) {
              // Guardar en localStorage
              localStorage.setItem('currentUser', JSON.stringify(response.body.user));
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
      `${environment.apiUrl}/Auth/logout`,
      {},
      { withCredentials: true }
  ).pipe(
      tap(() => {
          localStorage.removeItem('currentUser');
          this.currentUserSubject.next(null);
          this.isAuthenticated.next(false);
      })
  );
}

  private checkAuthentication(): void {
    const url = `${environment.apiUrl}/Auth/check`;

    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        const user = JSON.parse(storedUser);
        this.currentUserSubject.next(user);
        this.isAuthenticated.next(true);
    }
    
    this.http.get<User>(url, { 
        withCredentials: true,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).subscribe({
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
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';
import { environment } from '@env/environment'; // Actualizaremos esto con path alias
import { User, UserRole } from '@core/interfaces/user.interface'; // Actualizaremos esto con path alias
import { AlertService } from '@core/services/alert.service';// Actualizaremos esto con path alias

interface LoginResponse {
  token: string;
  user: User;
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
    this.checkToken();
  }


  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
          this.currentUserSubject.next(response.user);
          this.isAuthenticated.next(true);
          this.alertService.success('¡Bienvenido al Sistema VIP!');
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.isAuthenticated.next(false);
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  isAuthenticated$(): Observable<boolean> {
    return this.isAuthenticated.asObservable();
  }

  requestPasswordReset(email: string): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/auth/forgot-password`, { email });
  }

  private checkToken(): void {
    const token = localStorage.getItem('token');
    if (token) {
      // Aquí podríamos validar el token con el backend
      this.isAuthenticated.next(true);
    }
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




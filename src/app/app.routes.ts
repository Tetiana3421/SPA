import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { PetsListComponent } from './features/pets/list/pets-list.component';
import { PetDetailsComponent } from './features/pets/details/pet-details.component';
import { PetCreateComponent } from './features/pets/create/pet-create.component';
import { PetEditComponent } from './features/pets/edit/pet-edit.component';
import { BreedsListComponent } from './features/breeds/list/breeds-list.component';
import { BreedDetailsComponent } from './features/breeds/details/breed-details.component';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';
import { UsersComponent } from './features/users/users.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },

  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },


  {
    path: 'pets',
    canActivate: [AuthGuard],
    children: [
      { path: '', component: PetsListComponent },
      { path: 'create', component: PetCreateComponent },
      { path: ':id', component: PetDetailsComponent },
      { path: ':id/edit', component: PetEditComponent }
    ]
  },
  {
    path: 'breeds',
    canActivate: [AuthGuard],
    children: [
      { path: '', component: BreedsListComponent },
      { path: ':id', component: BreedDetailsComponent }
    ]
  },
  { path: 'users', component: UsersComponent, canActivate: [AdminGuard] },
  { path: '**', redirectTo: '' }
];

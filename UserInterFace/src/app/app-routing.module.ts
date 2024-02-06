import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { PageGuard } from './guards/page.guard';
import { FormType } from 'src/Types/enums/formType.enum';

const routes: Routes = [
 { path: '',
  redirectTo: 'login',
  pathMatch: 'full'
},
  {
  path: 'login',
  component:LoginComponent,
  data:{formType:FormType.login},
  canActivate:[AuthGuard],
},
{
  path: 'register',
  component:LoginComponent,
  data:{formType:FormType.register},
  canActivate:[AuthGuard],
  
},
{
  path: 'resetPassword',
  component:LoginComponent,
  data:{formType:FormType.resetPassword},
  canActivate:[AuthGuard],
  
},

  {
    path: 'dashboard/:id',
    loadChildren: () => import('./dashboard/dashboard.module').then( m => m.FolderPageModule),
    canActivate:[PageGuard]
    
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

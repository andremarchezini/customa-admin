import { AuthenticationService } from './../../../shared/authentication/authentication.service';
import { Component } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { QuestionDialogComponent } from '../../../shared/question-dialog/question-dialog.component';

@Component({
  selector: 'app-vertical-header',
  templateUrl: './vertical-header.component.html',
  styleUrls: [],
})
export class VerticalAppHeaderComponent {
  public config: PerfectScrollbarConfigInterface = {};

  constructor(
    private authSvc: AuthenticationService,
    private router: Router,
    public dialog: MatDialog,
  ) {}

  logout() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      title: 'Logout',
      message: 'Would you like to proceed?',
    };
    const dialogRef = this.dialog.open(QuestionDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.authSvc.setToken(null);
        this.router.navigateByUrl('/login');
      }
    });
  }
}

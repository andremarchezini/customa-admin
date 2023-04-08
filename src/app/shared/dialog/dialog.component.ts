import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent {
  data: any = {};
  constructor(@Inject(MAT_DIALOG_DATA) data: any) {
    this.data = data;
    console.log(data);
  }
}

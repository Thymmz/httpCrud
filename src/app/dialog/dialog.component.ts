import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef  } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  constructor( public dialogRef: MatDialogRef<DialogComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

  //send result to employee component for delete opertaion
  deleteEmp(functionalty: boolean){
    this.dialogRef.close({functionalty})
  }

  //send result to employee component for update opertaion
  updateEmp(compensation: number, functionalty: boolean){
    this.dialogRef.close({compensation, functionalty})
  }
}

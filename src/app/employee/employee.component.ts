import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import {Employee} from '../employee';
import { EmployeeService } from '../employee.service';
import { Observable, from} from 'rxjs';
import { flatMap, catchError} from 'rxjs/operators';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})

export class EmployeeComponent implements OnInit{
  @Input() employee: Employee;
  @Output() updateCompensation = new EventEmitter<Employee>();
  @Output() deleteReport = new EventEmitter<Employee>();
  totalEmployeeReports: number;
  reportName: Employee[];
  reportEmp: Employee;
  errorMessage: string;
  
  constructor(
    private employeeService: EmployeeService,
    public dialog: MatDialog,
    ) {
	  this.totalEmployeeReports = 0; //initialize direct reports
    this.reportName = []
  }
  ngOnInit(){
	this.setTotalReports(this.employee); //always run on start to display directReports on cards
  this.getReports(this.employee); //always keep direct reporting employees to supervisor
  }

  //set total number of reports for each employee
  setTotalReports(employee: Employee){
	if(employee.directReports){
		this.totalEmployeeReports += employee.directReports.length;
		from(employee.directReports).pipe(
			flatMap(id => <Observable<Employee>> 
			this.employeeService.get(id)),
      catchError(this.handleError.bind(this))
		).subscribe(
			nextEmployee => this.setTotalReports(nextEmployee)
		);
	}
  }

  //get employee data for the reports directly reporting to each employee
  getReports(employee: Employee){
    this.reportName = []
    if(employee.directReports){
      employee.directReports.forEach((id: number)=>
      this.employeeService.get(id).pipe(
        catchError(this.handleError.bind(this))
      )
      .subscribe(emp => this.reportName.push(emp), //push the employee to array of employees reporting to the supervising employee
      )
      )
  }
  }

  //Delete the employee id from the list of direct reports and send updated employee to employee list component
  deleteEmpReport(reporter : Employee, employee: Employee){
    if (employee.directReports.includes(reporter.id)){
      const index = employee.directReports.indexOf(reporter.id, 0);
      employee.directReports.splice(index, 1);
      this.deleteReport.emit(employee)
    }
  }

  //open dialog on click and send the required
  openDialog(reporter : Employee, btnType: string){
    this.reportEmp = reporter
    let dialogRef = this.dialog.open(DialogComponent, 
      {
        data : {reporter, updateDelete: btnType
    }});

    dialogRef.afterClosed().subscribe(
      result => {
      if (result.functionalty == 0){
        //delete the employee from direct reports and re initialize direct reports and total number of direct reports
        this.deleteEmpReport(this.reportEmp, this.employee)
        this.getReports(this.employee)
        this.totalEmployeeReports = 0
        this.setTotalReports(this.employee)  
      }

      else if (result.functionalty == 1){
        this.reportEmp.compensation = result.compensation
        this.updateCompensation.emit(this.reportEmp) //Update the employee and send updated employee to employee list component
      }
      }
    )
  }

  private handleError(e: Error | any): string {
    console.error(e);
    return this.errorMessage = e.message || 'Unable to retrieve employees';
  }
}
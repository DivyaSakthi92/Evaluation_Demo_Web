import { Component, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';

import { Audit, User } from '@/_models';
import { AuditService, AuthenticationService } from '@/_services';
import { MatTableDataSource } from '@angular/material';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component(
    { templateUrl: 'audit.component.html'
    }
    )
export class AuditComponent implements OnInit
{
    audits = [];
    currentUser: User;
    displayedColumns: string[] = ['id', 'ip', 'loginTime', 'logoutTime' , 'user'];
    filterValue;
    dataSource = new MatTableDataSource(this.audits);
    loading = true;
    @ViewChild('paginator',{static: false}) paginator: MatPaginator;
    @ViewChild(MatSort,{static: false}) sort: MatSort;
    dateFormatValue = "dd/MM/yyyy hh:mm:ss" ;
    constructor(
        private authenticationService: AuthenticationService,
        private auditService: AuditService)
    {
        this.currentUser = this.authenticationService.currentUserValue;
    }

    /**to set date format based on user input */
    setDateFormat(e){
       if(e.value == 1){
        this.dateFormatValue = "dd/MM/yyyy hh:mm:ss"
       }else{
        this.dateFormatValue = "dd/MM/yyyy HH:mm:ss"
       }
    }
    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }
   
    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); 
        filterValue = filterValue.toLowerCase(); 
        this.dataSource.filter = filterValue;
    }
    ngOnInit()
    {
        this.loadAllAudits();
    }

    private loadAllAudits()
    {
        this.auditService.getAll()
            .pipe(first())
            .subscribe((audits) =>{
                this.audits = audits
                this.loading = false;
                this.dataSource = new MatTableDataSource(this.audits);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort
            } 
                );
    }
}
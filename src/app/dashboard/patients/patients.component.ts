import { ConnectService } from '../../shared/connect/connect.service';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Router } from '@angular/router';

export interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
}

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss'],
})
export class PatientsComponent implements OnInit {
  displayedColumns = ['firstName', 'lastName', 'email', 'mobile'];
  data: Patient[] = [];
  dataSource = new MatTableDataSource<Patient>(this.data);

  loading = false;

  length = 0;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];

  @ViewChild('paginator') paginator: MatPaginator | null = null;

  constructor(
    breakpointObserver: BreakpointObserver,
    private connectSvc: ConnectService,
    private changeDetectorRefs: ChangeDetectorRef,
    private router: Router,
  ) {
    breakpointObserver.observe(['(max-width: 600px)']).subscribe((result) => {
      this.displayedColumns = result.matches
        ? ['firstName', 'lastName', 'email', 'mobile']
        : ['firstName', 'lastName', 'email', 'mobile'];
    });
  }

  async ngAfterViewInit() {
    await this.loadData();
    this.dataSource.paginator = this.paginator;
  }

  async ngOnInit() {}

  search(event: Event) {
    this.loadData((event.target as HTMLInputElement).value);
  }

  async loadData(query?: string | null | undefined) {
    this.dataSource.data = await this.connectSvc.get<Patient[]>(
      query ? `Patient?keyword=${query}` : 'Patient',
      true,
    );
    this.length = this.dataSource.data.length;
  }

  open(patient: Patient) {
    this.router.navigateByUrl(`dashboard/patient/${patient.id}`);
  }
}

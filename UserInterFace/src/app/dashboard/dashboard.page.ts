import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServerDto } from 'src/Types/interfaces/Server.dto';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  public servers:ServerDto[]=[
    {Name:"simple",Servers:[]},{Name:"group1",Servers:[{Name:"server 1"},{Name:"server 2"}]},{Name:"group2",Servers:[{Name:"server 1"},{Name:"server 2"}]}
  ];
  constructor() {}
  ngOnInit() {
  }
}

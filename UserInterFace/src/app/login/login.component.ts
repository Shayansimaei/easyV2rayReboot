import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent  implements OnInit {
  public isRegister:boolean=false;
  constructor(private route:ActivatedRoute) { 
    this.isRegister=this.route.snapshot.data["isRegester"];
  }

  ngOnInit() {}

}

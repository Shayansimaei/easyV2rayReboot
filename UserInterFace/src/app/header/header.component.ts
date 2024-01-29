import { Component, Input, OnInit, input } from '@angular/core';
import { Slot } from 'src/Types/enums/header/slot.enum';

@Component({
  selector: 'headerComponent',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  implements OnInit {
  @Input({required:true}) title!:string;
  @Input("slot") posation:Slot=Slot.start
  constructor() { }
  ngOnInit() {}

}

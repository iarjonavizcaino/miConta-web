import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-despachos',
  templateUrl: './despachos.component.html',
  styleUrls: ['./despachos.component.css']
})
export class DespachosComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }
  sub: any;

  ngOnInit() {

  }

}// class

import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DiscotecaPreviewComponent } from './discoteca-preview.component';

import {
  Discoteca,
  DiscotecasService
} from '../../core';

@Component({
  selector: 'app-discoteca-details',
  templateUrl: './discoteca-details.component.html',
  styleUrls: ['./discoteca.component.css']
})
export class DiscotecaDetailsComponent implements OnInit {
  @Input()
  discoteca!: Discoteca;

  constructor(
    private route:ActivatedRoute,
    private discotecasService:DiscotecasService,
    private router:Router,

  ) {}
  
  ngOnInit(): void { 
    
      //Details
      this.route.data.subscribe((data) => {
          this.discoteca = data.discoteca;

          // this.populateComments();
        }
      );
  }
  //Aqui irá el delete, update, comments, favorited...
  
}
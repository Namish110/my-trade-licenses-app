import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Route, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-control-sheet',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './control-sheet.html',
  styleUrl: './control-sheet.css',
})
export class ControlSheet {

  constructor(private router: Router){}

}

import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-loader',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './loader.html',
  styleUrl: './loader.css',
})
export class Loader {
   @Input() show = false;
}

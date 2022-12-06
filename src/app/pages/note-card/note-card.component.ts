import { Component } from '@angular/core';
import { faXmark } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-note-card',
  templateUrl: './note-card.component.html',
  styleUrls: ['./note-card.component.css']
})
export class NoteCardComponent {
  faXmark = faXmark;
}

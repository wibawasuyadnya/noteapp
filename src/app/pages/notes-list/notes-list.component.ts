import { transition, trigger, style, animate } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Note } from 'src/app/shared/note.model';
import { NotesService } from 'src/app/shared/notes.service';

@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.css'],
  animations: [
    trigger('itemAnim', [
        //entery animations
        transition('void => *', [
          style({
            height:  0,
            opacity: 0,
            transform: 'scale(0.85)',
            'margin-bottom': 0,

            //expand padding for certain browser bug
            padingTop: 0,
            paddingBottom: 0,
            PaddingRight: 0,
            PaddingLeft: 0
          }),
          //animation spacing margin and height
           animate('50ms', style({
            height: '*',
            'margin-b0ttom': '*',
            padingTop: '*',
            paddingBottom: '*',
            PaddingRight: '*',
            PaddingLeft: '*'
           })),
           animate(68)
        ]),

        transition('* => void', [
            
        ])

    ])
  ]

})
export class NotesListComponent implements OnInit {

  notes: Note[] = new Array<Note>();

  constructor(private notesService: NotesService){ }

  ngOnInit() {
    this.notes = this.notesService.getAll();
  }

  deleteNote(id: number){
    this.notesService.delete(id);
  }

}

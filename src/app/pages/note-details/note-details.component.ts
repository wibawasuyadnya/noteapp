import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Note } from 'src/app/shared/note.model';
import { NotesService } from 'src/app/shared/notes.service';

@Component({
  selector: 'app-note-details',
  templateUrl: './note-details.component.html',
  styleUrls: ['./note-details.component.css']
})
export class NoteDetailsComponent implements OnInit {

    note: Note;
    noteId: number;
    new: boolean;

    constructor( private notesServices: NotesService, private router: Router, private route : ActivatedRoute ){  }

    ngOnInit() {
      
      this.note = new Note();

      this.route.params.subscribe((params: Params) => {
        if(params['id']) {
          this.note = this.notesServices.get(params['id']);
          this.noteId = params['id'];
          this.new = false;
        } else {
          this.new = true;
        }
      })


    }

    onSubmit(form: NgForm) {

      if(this.new) {
        this.notesServices.add(form.value);
      } else {
        this.notesServices.update(this.noteId, form.value.title, form.value.body );
      }
      
      this.router.navigateByUrl('/');

    } 

    cancel(){
      this.router.navigateByUrl('/'); 
    }
}

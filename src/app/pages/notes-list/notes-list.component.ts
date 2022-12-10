import { transition, trigger, style, animate, query, stagger } from '@angular/animations';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
            padding: 0,
          }),
          //animation spacing margin and height
           animate('50ms', style({
            height: '*',
            'margin-bottom': '*',
            padding: '*',
           })),
           animate(68)
        ]),

        transition('* => void', [
            //first scale up
            animate(50, style({
              transform: 'scale(1.05)',
            })),
            //second is scale down back to normal and beginning to fade out
            animate(50, style({
              transform: 'scale(1)',
              opacity: 0.75,
            })),
            //scale down and fade out
            animate('120ms ease-out', style({
              transform: 'scale(0.68)',
              opacity: 0,
            })),
            //animate spacing height, margin and padding
            animate('150ms ease-out', style({
              height: 0,
              padding: 0,
              'margin-left': 0,
            }))
        ])
    ]),

    trigger('listAnim', [
      transition('* => *', [
         query(':enter', [ 
            style({
              opacity: 0, 
              height: 0,
            }),
            stagger(100, [
              animate('0.2s ease')
            ])
         ], {
            optional: true,
         })
      ])
    ])

  ]

})
export class NotesListComponent implements OnInit {

  notes: Note[] = new Array<Note>();
  filteredNotes : Note[] = new Array<Note>();

  @ViewChild('filterInput') filterInputElRef: ElementRef<HTMLInputElement>;


  constructor(private notesService: NotesService){ }

  ngOnInit() {
    this.notes = this.notesService.getAll();
    this.filteredNotes = this.notes;
  }

  deleteNote(id: number){
    this.notesService.delete(id);
  }

  filter(query: string){
    query = query.toLowerCase().trim();

    let allResults :  Note[] = new Array<Note>();
    
    let terms : string[] =  query.split(' ');
    terms = this.removeDuplicates(terms);
    terms.forEach(term => {
      let results: Note[] = this.relevantNotes(term);
      //append all results to allResults array
      allResults = [...allResults, ...results];
    });

    //remove the duplicates notes

    let uniqueResults = this.removeDuplicates(allResults);
    this.filteredNotes = uniqueResults;

    this.sortByRelevancy(allResults);

  }

  removeDuplicates(arr: Array<any>) : Array<any> {
    let uniqueResults: Set<any> = new Set<any>();
    arr.forEach(e => uniqueResults.add(e)); 

    return Array.from(uniqueResults);

  }
 
  relevantNotes(query: string) : Array<Note> {
    query = query.toLowerCase().trim();
    let relevantNotes = this.notes.filter(note => {
      if(note.title && note.title.toLowerCase().includes(query)){
        return true;
      }
      if(note.body && note.body.toLowerCase().includes(query)){
        return true;
      }
      return false;
    })
    return relevantNotes;
  }

  sortByRelevancy(searchResults: Note[]) {
    // This method will calculate the relevancy of a note based on the number of times it appears in
    // the search results

    let noteCountObj: {[noteId: number]: number} = {}; // format - key:value => NoteId:number (note object id : count)

    searchResults.forEach(note => {
     let noteId = this.notesService.getId(note);

      if (noteCountObj[noteId]) {
        noteCountObj[noteId] += 1;
      } else {
        noteCountObj[noteId] = 1;
      }
    })

    this.filteredNotes = this.filteredNotes.sort((a: Note, b: Note) => {
      let aId = this.notesService.getId(a);
      let bId = this.notesService.getId(b);

      let aCount = noteCountObj[aId];
      let bCount = noteCountObj[bId];

      return bCount - aCount;
    })
  }


}

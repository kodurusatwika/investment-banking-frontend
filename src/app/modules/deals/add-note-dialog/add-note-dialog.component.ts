import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-note-dialog',
  templateUrl: './add-note-dialog.component.html',
  styleUrls: ['./add-note-dialog.component.css'],
  standalone: false
})
export class AddNoteDialogComponent {
  noteForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddNoteDialogComponent>
  ) {
    this.noteForm = this.fb.group({
      note: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  onSubmit(): void {
    if (this.noteForm.valid) {
      this.dialogRef.close(this.noteForm.value.note);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
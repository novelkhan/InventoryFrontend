import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

export enum ProgressType {
  Linear = 'linear',
  Circular = 'circular'
}

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent implements OnChanges {
  @Input() progress: number = 0; // 0-100
  @Input() showText: boolean = true; // টেক্সট দেখাবে কিনা
  @Input() type: ProgressType = ProgressType.Linear; // লিনিয়ার বা সার্কুলার
  @Input() speed: number = 500; // অ্যানিমেশন স্পিড (ms)
  @Input() color: string = 'primary'; // কালার থিম (primary, success, warning, danger)
  @Input() autoHide: boolean = true; // 100% হলে লুকিয়ে যাবে কিনা

  @Output() progressComplete = new EventEmitter<void>(); // কমপ্লিট হলে ইমিট

  ProgressType = ProgressType; // টেমপ্লেটে ব্যবহারের জন্য

  private radius = 52; // সার্কেলের রেডিয়াস
  circumference = 2 * Math.PI * this.radius; // সার্কেলের পরিধি

  get dashOffset(): number {
    return this.circumference - (this.progress / 100) * this.circumference;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['progress'] && this.progress >= 100 && this.autoHide) {
      setTimeout(() => {
        this.progressComplete.emit();
      }, this.speed);
    }
  }

  getProgressColor(): string {
    switch (this.color) {
      case 'success': return 'linear-gradient(90deg, #28a745, #20c997)';
      case 'warning': return 'linear-gradient(90deg, #ffc107, #fd7e14)';
      case 'danger': return 'linear-gradient(90deg, #dc3545, #c82333)';
      default: return 'linear-gradient(90deg, #007bff, #0056b3)';
    }
  }
}
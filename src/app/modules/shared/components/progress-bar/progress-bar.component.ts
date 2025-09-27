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
  @Input() progress: number = 0;
  @Input() showText: boolean = true;
  @Input() type: ProgressType = ProgressType.Linear;
  @Input() speed: number = 500;
  @Input() color: string = 'primary';
  @Input() autoHide: boolean = true;

  @Output() progressComplete = new EventEmitter<void>();

  ProgressType = ProgressType;

  private radius = 52;
  circumference = 2 * Math.PI * this.radius;

  get dashOffset(): number {
    const progressOffset = (this.progress / 100) * this.circumference;
    return this.circumference - progressOffset;
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
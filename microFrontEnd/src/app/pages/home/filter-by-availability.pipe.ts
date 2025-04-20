import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByAvailability'
})
export class FilterByAvailabilityPipe implements PipeTransform {
  transform(chambres: any[]): any[] {
    return chambres.filter(chambre => chambre.disponibilite === true);
  }
}
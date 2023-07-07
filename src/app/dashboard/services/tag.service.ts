import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Tag } from '../models/tag';

@Injectable({
  providedIn: 'root'
})
export class TagService {

  constructor(private apollo: Apollo) {
    // this.loadEntities(); // Llama al método para cargar los datos al inicializar el servicio
  }

  // loadEntities() {

  //   this.getTags().subscribe(tags => {
  //     this.entities = tags.map(tag => ({ label: tag.typeEntityId?.name, value: tag.typeEntityId?.id }));
  //   });
  // }

  entities: any[] = [
    { label: 'Pecoso', value: 1 },
    { label: 'HCP', value: 2 },
    { label: 'Pacientes', value: 3 },
    { label: 'Admin', value: 4 },
  ];

  getTags(): Observable<Tag[]> {
    return this.apollo.watchQuery({
      query: gql`
        query {
          getTags {
            id,
            typeEntityId {
              id,
              name
            },
            name,
            isActive
          }
        }
      `,
      fetchPolicy: 'network-only',
    }).valueChanges.pipe(
      map((result: any) => result.data.getTags),
      take(1)
    );
  }

  getTag(id: number): Observable<Tag> {
    return this.apollo.watchQuery({
      query: gql`
        query getTag($id: ID!) {
          tag(id: $id) {
            id,
            typeEntityId,
            name,
            isActive
          }
        }
      `,
      variables: { id },
      fetchPolicy: 'network-only',
    }).valueChanges.pipe(
      map((result: any) => result.data.getTag),
      take(1)
    );
  }

  createTags(tag: Tag): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`
        mutation createTags(
          $name: String!,
          $typeEntityId: Int!,
        ) {
          createTags(
            name: $name,
            typeEntityId: $typeEntityId,
          ) {
            id
          }
        }
      `,
      variables: { name: tag.name, typeEntityId: tag.typeEntityId },
    }).pipe(
      map((result: any) => result.data.createTags)
    );
  }
}

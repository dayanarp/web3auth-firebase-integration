import { Observable, of, switchMap } from 'rxjs';

export const handleEvent =
  <SourceType, OutputType>(
    project: (value: SourceType) => Observable<OutputType | null>
  ) =>
  (source: Observable<SourceType | null>): Observable<OutputType | null> =>
    source.pipe(
      switchMap((payload) => (payload === null ? of(null) : project(payload)))
    );
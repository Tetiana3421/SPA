import { BreedNamePipe } from '../../pipes/breed-name.pipe';

describe('BreedNamePipe', () => {
  it('transforms id to name', () => {
    const pipe = new BreedNamePipe();
    const breeds = [{id:'b1', name:'Лабрадор', species:'dog'}];
    expect(pipe.transform('b1', breeds as any)).toBe('Лабрадор');
    expect(pipe.transform('none', breeds as any)).toBe('—');
  });
});
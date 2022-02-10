import {InMemoryDbService} from 'angular-in-memory-web-api';

export class BackendlessMockService implements InMemoryDbService {
  createDb() {
    const employees = [
      {
        id: 1,
        firstName: 'Prashant',
        lastName: 'Singht',
        position: 'CEO',
        directReports: [2, 3]
      },
      {
        id: 2,
        firstName: 'Nishit',
        lastName: 'De',
        position: 'Dev Manager',
        directReports: [4]
      },
      {
        id: 3,
        firstName: 'Atharva',
        lastName: 'Deshpande',
        position: 'Lead Tester',
        directReports: [5]
      },
      {
        id: 4,
        firstName: 'Aditya',
        lastName: 'Chaudhari',
        position: 'Junior Software Engineer'
      },
      {
        id: 5,
        firstName: 'Sushanth',
        lastName: 'Reddy',
        position: 'Junior Software Engineer'
      }
    ];
    return {employees};
  }
}

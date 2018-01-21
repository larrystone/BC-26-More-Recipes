import cake from './../../../images/cake.jpg';
import bhindi from './../../../images/bhindi.jpg';
import friedRice from './../../../images/friedRice.jpg';
import dodo from './../../../images/dodo.jpg';
import egusi from './../../../images/egusi.jpg';

export default [
  {
    id: 1,
    imageUrl: cake,
    name: 'Chocolate Cake',
    description: 'A desert respected all over',
    User: { name: 'Larrystone' },
    upvotes: '500',
    downvotes: '0'
  },
  {
    id: 2,
    imageUrl: bhindi,
    name: 'Bhindi',
    description: 'Priceless vegetable meal from Mali',
    User: { name: 'Rowland' },
    upvotes: '400',
    downvotes: '20'
  },
  {
    id: 3,
    imageUrl: friedRice,
    name: 'Fried Rice',
    description: 'Nothing taste better',
    User: { name: 'Shayo' },
    upvotes: '390',
    downvotes: '0'
  },
  {
    id: 4,
    imageUrl: dodo,
    name: 'Fried Plaintain (Dodo)',
    description: 'Everyone loves dodo!',
    User: { name: 'Larrystone' },
    upvotes: '350',
    downvotes: '0'
  },
  {
    id: 5,
    imageUrl: egusi,
    name: 'Egusi Soup',
    description: 'One of the best Nigerian delicacy',
    User: { name: 'Larrystone' },
    upvotes: '200',
    downvotes: '0'
  }
];

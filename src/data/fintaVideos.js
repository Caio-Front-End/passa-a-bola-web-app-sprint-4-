//vídeos do finta
import lailabrandao from '../assets/finta-src/@lailabrandao.mp4';
import passaabola from '../assets/finta-src/@passaabola.mp4';
import raquelfreestyle from '../assets/finta-src/@raquelfreestyle.mp4';
//fotos de perfil
import lailaprofpic from '../assets/finta-profile-pic/lailabrandao-profilepic.jpg';
import pabprofpic from '../assets/finta-profile-pic/passaabola-profilepic.jpg';
import raqfreestyleprofpic from '../assets/finta-profile-pic/raquelfreestyle-profilepic.jpg';

export const fintaVideos = [
  {
    id: 1,
    user: {
      name: '@Lailabrandao',
      avatar: lailaprofpic,
    },
    videoUrl: lailabrandao,
    caption:
      'Quando dizem que futebol não é pra menina. #finta ⚽️ #futebolfeminino',
    likes: 1245,
    comments: 89,
  },
  {
    id: 2,
    user: {
      name: '@passabola',
      avatar: pabprofpic,
    },
    videoUrl: passaabola,
    caption: 'Brasil nas olimpíadas #finta #passabola',
    likes: 2310,
    comments: 150,
  },
  {
    id: 3,
    user: {
      name: '@raquelfreestyle',
      avatar: raqfreestyleprofpic,
    },
    videoUrl: raquelfreestyle,
    caption: '#Drible rápido de #Futsal #tutorial',
    likes: 987,
    comments: 65,
  },
];

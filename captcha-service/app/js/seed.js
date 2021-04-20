// from:
//   https://bookriot.com/1984-quotes/

const seedPhrases = [
  {
    book: '1984',
    phrases: {
      en: [
        'Perhaps one did not want to be loved, so much as to be understood.',
        'The heresy of heresies was common sense.',
        'Nothing was your own.',
        'Who controls the past controls the future.',
        'Who controls the present controls the past.',
        'No one ever seizes power with the intention of relinquishing it.',
        'Power is in tearing human minds to pieces.',
        'Nothing exists except an endless present.',
        'You will be hollow, and then we shall fill you.',
        'If you want to keep a secret you must also hide it from yourself.'
      ],
      pt: [
        'Talvez não quisesse ser estimado, mas compreendido.',
        'O bom senso era a heresia das heresias.',
        'Nada pertencia ao indivíduo.',
        'Quem controla o passado, controla o futuro.',
        'Quem controla o presente controla o passado.',
        'Ninguém jamais toma o poder com a intenção de largá-lo.',
        'O poder está na capacidade de despedaçar a mente.',
        'Nada existe, exceto um presente sem fim.',
        'Serás oco, e então saberemos como te encher.',
        'Para guardar um segredo é preciso escondê-lo de si mesmo.'
      ]
    }
  },
  {
    book: 'Frankenstein',
    phrases: {}
  },
  {
    book: 'Do Androids Dream of Electric Sheep',
    phrases: {}
  }
]

if (typeof module !== 'undefined') module.exports.seed = seedPhrases;

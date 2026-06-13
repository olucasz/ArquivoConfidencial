import originHint1 from "../assets/images/placeholders/origin-hint-1.jpg";
import originHint2 from "../assets/images/placeholders/origin-hint-2.jpg";
import originHint3 from "../assets/images/placeholders/origin-hint-3.jpg";
import originHint4 from "../assets/images/placeholders/origin-hint-4.jpg";
import nosDoisCoverImage from "../assets/images/placeholders/nos-dois-cover.jpg";
// Preferir vídeos .mp4 H.264/AAC. Arquivos .MOV podem ficar pretos em alguns navegadores.
import proposalGalleryVideo1901 from "../assets/images/galeriaPedido/IMG_1901.MOV?url";
import proposalGalleryPhoto1912 from "../assets/images/galeriaPedido/IMG_1912.JPG?url";
import proposalGalleryVideo1946 from "../assets/images/galeriaPedido/IMG_1946.MOV?url";
import proposalGalleryVideo1975 from "../assets/images/galeriaPedido/IMG_1975.MOV?url";
import proposalGalleryPhoto2024 from "../assets/images/galeriaPedido/IMG_2024.JPG?url";
import proposalGalleryVideo2056 from "../assets/images/galeriaPedido/IMG_2056.MOV?url";
import proposalGalleryPhotoWelcome from "../assets/images/galeriaPedido/WhatsApp Image 2026-06-13 at 15.51.54.jpeg?url";
import proposalGalleryPhotoPicnic2 from "../assets/images/galeriaPedido/WhatsApp Image 2026-06-13 at 16.07.17-2.jpeg?url";
import proposalGalleryPhotoPicnic3 from "../assets/images/galeriaPedido/WhatsApp Image 2026-06-13 at 16.07.17-3.jpeg?url";
import proposalGalleryPhotoPicnic4 from "../assets/images/galeriaPedido/WhatsApp Image 2026-06-13 at 16.07.17-4.jpeg?url";
import proposalGalleryPhotoPicnic5 from "../assets/images/galeriaPedido/WhatsApp Image 2026-06-13 at 16.07.17-5.jpeg?url";
import proposalGalleryPhotoPicnic1 from "../assets/images/galeriaPedido/WhatsApp Image 2026-06-13 at 16.07.17.jpeg?url";
import proposalDayImage from "../assets/images/placeholders/proposal-day.jpg";
import proposalIdeaImage from "../assets/images/placeholders/proposal-idea.jpg";
import proposalPreparationsImage from "../assets/images/placeholders/proposal-preparations.jpg";
import proposalRingImage from "../assets/images/placeholders/proposal-ring.jpg";
import rememberedYouImage from "../assets/images/placeholders/remembered-you.jpg";

export type SceneSpeaker = "sistema" | "Lucas" | null;

export type SceneType =
  | "default"
  | "password"
  | "photoSequence"
  | "memoryCards"
  | "checklist"
  | "choicePuzzle"
  | "proposalGallery"
  | "memoryBox"
  | "musicAchievements"
  | "finalLetter"
  | "ending";

export type StoryScene = {
  id: string;
  title: string;
  speaker: SceneSpeaker;
  messages: string[];
  actionLabel: string;
  type?: SceneType;
  photos?: {
    id: string;
    caption: string;
    imageSrc?: string;
    imageFit?: "contain" | "cover";
    imageLayout?: "standard" | "square";
    imagePosition?: string;
  }[];
  cards?: {
    id: string;
    title: string;
    text?: string;
  }[];
  checklist?: string[];
  checklistTitle?: string;
  afterMessages?: string[];
  memoryCard?: {
    title: string;
    text: string;
    imageSrc?: string;
    imageFit?: "contain" | "cover";
    imageLayout?: "standard" | "square";
    imagePosition?: string;
  };
  puzzle?: {
    question: string;
    options: {
      id: string;
      label: string;
      errorFeedback?: string[];
    }[];
    correctOptionId: string;
    successFeedback: string[];
    generalErrorFeedback?: string[];
  };
  revelations?: {
    id: string;
    title: string;
    mediaSrc?: string;
    mediaType?: "image" | "video";
    imageFit?: "contain" | "cover";
    imageLayout?: "standard" | "square";
    imagePosition?: string;
  }[];
  stories?: {
    id: string;
    mediaSrc?: string;
    mediaType?: "image" | "video";
  }[];
  memoryBoxItems?: {
    id: string;
    title: string;
    text: string[];
    placeholder: string;
    media?: {
      type: "image" | "video";
      src: string;
    }[];
  }[];
  music?: {
    title: string;
    artist: string;
    audioSrc?: string;
    coverSrc?: string;
  };
  counterIntroMessages?: string[];
  achievements?: {
    stats: {
      label: string;
      value: string;
    }[];
    locked: string[];
  };
  closingMessages?: string[];
  letter?: string;
  ending?: {
    title: string;
    lines: string[];
  };
};

export type StoryData = {
  userNameExpected: string;
  passwordExpected: string;
  firstDate: string;
  firstVisitDate: string;
  proposalDate: string;
  relationshipStartDate: string;
  firstDateToProposalDays: number;
  scenes: StoryScene[];
};

const firstDate = "2025-07-22";
const firstVisitDate = "2025-07-31";
const proposalDate = "2025-10-04";
const firstDateToProposalDays = 74;
const audioFiles = import.meta.glob("../assets/audio/*.{mp3,MP3,wav,WAV,m4a,M4A,ogg,OGG}", {
  eager: true,
  import: "default",
  query: "?url",
}) as Record<string, string>;
// Preferir vídeos .mp4 H.264/AAC. Arquivos .MOV podem ficar pretos em alguns navegadores.
const memoryBoxMediaFiles = import.meta.glob(
  "../assets/images/{nenoEnena,coisasPequenas,risadas,oQueFica}/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP,mp4,webm,mov,MP4,WEBM,MOV}",
  {
    eager: true,
    import: "default",
    query: "?url",
  },
) as Record<string, string>;

const getMemoryMedia = (folderName: string) =>
  Object.entries(memoryBoxMediaFiles)
    .filter(([path]) => path.includes(`/${folderName}/`))
    .sort(([pathA], [pathB]) =>
      pathA.localeCompare(pathB, "pt-BR", {
        numeric: true,
        sensitivity: "base",
      }),
    )
    .map(([path, src]) => ({
      type: /\.(mov|mp4|webm)$/i.test(path) ? ("video" as const) : ("image" as const),
      src,
    }));

const memoryBoxMedia = {
  nenoNena: getMemoryMedia("nenoEnena"),
  coisasPequenas: getMemoryMedia("coisasPequenas"),
  risadas: getMemoryMedia("risadas"),
  oQueFicou: getMemoryMedia("oQueFica"),
};
const normalizeAssetPath = (path: string) =>
  path
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR");
const nosDoisAudio =
  Object.entries(audioFiles).find(([path]) => normalizeAssetPath(path).includes("nos dois"))?.[1] ??
  Object.values(audioFiles)[0];

export const storyData: StoryData = {
  userNameExpected: "Kamila",
  passwordExpected: "041025",
  firstDate,
  firstVisitDate,
  proposalDate,
  relationshipStartDate: firstDate,
  firstDateToProposalDays,
  scenes: [
    {
      id: "password",
      title: "ARQUIVO CONFIDENCIAL",
      speaker: "sistema",
      messages: ["tem algo guardado aqui.", "mas não é para qualquer pessoa."],
      actionLabel: "[ liberar acesso ]",
      type: "password",
    },
    {
      id: "intro",
      title: "A CARTA",
      speaker: "Lucas",
      messages: [
        "eu comecei uma carta para você.",
        "mas ela não terminou no papel.",
        "algumas partes ficaram pelo caminho.",
      ],
      actionLabel: "[ procurar a primeira parte ]",
      type: "default",
    },
    {
      id: "originSearch",
      title: "O INÍCIO",
      speaker: "Lucas",
      messages: ["vamos procurar onde isso começou."],
      actionLabel: "[ continuar ]",
      type: "photoSequence",
      photos: [
        {
          id: "origin-1",
          caption: "não. ainda não era aqui.",
          imageSrc: originHint1,
          imageFit: "cover",
          imageLayout: "square",
          imagePosition: "center",
        },
        {
          id: "origin-2",
          caption: "também não.",
          imageSrc: originHint2,
          imageFit: "cover",
          imageLayout: "square",
          imagePosition: "center 40%",
        },
        {
          id: "origin-3",
          caption: "quase.",
          imageSrc: originHint3,
          imageFit: "cover",
          imageLayout: "square",
          imagePosition: "center 45%",
        },
        {
          id: "origin-4",
          caption: "aqui.",
          imageSrc: originHint4,
          imageFit: "cover",
          imageLayout: "square",
          imagePosition: "center 28%",
        },
      ],
      afterMessages: [
        "talvez eu não tenha percebido na hora.",
        "mas alguma coisa mudou depois daqui.",
      ],
    },
    {
      id: "smallSigns",
      title: "PEQUENOS SINAIS",
      speaker: "Lucas",
      messages: ["antes de virar história,", "teve detalhe."],
      actionLabel: "[ continuar ]",
      type: "memoryCards",
      cards: [
        {
          id: "backpack",
          title: "uma mochila.",
          text: "eu fui quase seu segurança particular.",
        },
        {
          id: "cafeteria",
          title: "uma conversa no refeitório.",
          text: "não era nada importante, só queria estar perto.",
        },
        {
          id: "hard-talks",
          title: "assuntos difíceis.",
          text: "nem tudo começou leve. mas algumas coisas precisavam ser atravessadas.",
        },
        {
          id: "decision",
          title: "uma decisão.",
          text: "eu decidi te chamar para sair.",
        },
      ],
    },
    {
      id: "firstDateClues",
      title: "PRIMEIRO DATE",
      speaker: "Lucas",
      messages: [
        "uma mensagem foi enviada.",
        "e depois dela,",
        "algumas coisas começaram a sair do lugar.",
      ],
      actionLabel: "[ continuar ]",
      type: "memoryCards",
      cards: [
        {
          id: "superman",
          title: "Superman",
          text: "o filme era esse. mas a história que eu lembro é outra.",
        },
        {
          id: "los-bragas",
          title: "Los Bragas",
          text: "a primeira parada depois do cinema.",
        },
        {
          id: "onion-rings",
          title: "Onion rings",
          text: "uma escolha questionável, mas histórica.",
        },
        {
          id: "back-seat",
          title: "Banco do passageiro",
          text: "esse detalhe precisava estar registrado.",
        },
      ],
    },
    {
      id: "myWorld",
      title: "MEU MUNDO",
      speaker: "Lucas",
      messages: [
        "nesse dia, você entrou de vez no meu mundo.",
        "e eu vi que tudo fazia sentido.",
        "a gente combina :)",
      ],
      actionLabel: "[ continuar ]",
      type: "memoryCards",
      cards: [
        {
          id: "friends",
          title: "amigos",
          text: "um pedaço de mim que você conheceu. E você abraçou.",
        },
        {
          id: "parents",
          title: "meus pais",
          text: "um encontro simples, uma maionese, mas nada pequeno para mim.",
        },
        {
          id: "magal",
          title: "churrasco no Magal",
          text: "um daqueles dias que ficam marcados sem fazer barulho.",
        },
        {
          id: "hand",
          title: "um detalhe guardado",
          text: "foi a primeira vez que eu segurei sua mão.",
        },
      ],
      afterMessages: [
        "às vezes,",
        "o que marca não é o tamanho do dia.",
        "é o tamanho do detalhe.",
      ],
    },
    {
      id: "beforeSimple",
      title: "ANTES DE SER SIMPLES",
      speaker: "Lucas",
      messages: [
        "nem tudo foi direto.",
        "teve conversa.",
        "teve dúvida.",
        "teve medo.",
        "teve oração.",
      ],
      actionLabel: "[ continuar ]",
      type: "checklist",
      checklistTitle: "reunião de balanço",
      checklist: [
        "sentimentos",
        "dúvidas",
        "“e agora?”",
        "oração",
        "nós dois tentando entender",
      ],
      afterMessages: [
        "ata aprovada.",
        "e no meio de tudo isso,",
        "teve uma coisa pequena.",
      ],
      memoryCard: {
        title: "lembrei de você.",
        text: "acho que essa frase dizia mais do que parecia.",
        imageSrc: rememberedYouImage,
        imageFit: "cover",
        imageLayout: "square",
        imagePosition: "center 45%",
      },
    },
    {
      id: "daysPuzzle",
      title: "QUANTO TEMPO PASSOU?",
      speaker: "Lucas",
      messages: [
        "entre o primeiro dia que saímos",
        "e uma pergunta importante,",
        "alguns dias passaram.",
        "quantos?",
      ],
      actionLabel: "[ continuar ]",
      type: "choicePuzzle",
      puzzle: {
        question: "quantos dias passaram?",
        options: [
          {
            id: "seven-days",
            label: "7 dias",
          },
          {
            id: "twenty-one-days",
            label: "31 dias",
          },
          {
            id: "configured-days",
            label: `${firstDateToProposalDays} dias`,
          },
          {
            id: "two-hundred-days",
            label: "89 dias",
          },
        ],
        correctOptionId: "configured-days",
        generalErrorFeedback: [
          "quase.",
          "mas pensa melhor...",
          "esse tempo teve cinema, conversa, presente e muita coisa guardada.",
        ],
        successFeedback: [
          "isso.",
          `${firstDateToProposalDays} dias.`,
          "e esses dias estavam levando",
          "a uma pergunta.",
        ],
      },
    },
    {
      id: "proposalDestinationPuzzle",
      title: "PARA ONDE?",
      speaker: "Lucas",
      messages: [
        "desde o primeiro dia que saímos,",
        `esses ${firstDateToProposalDays} dias estavam levando até:`,
      ],
      actionLabel: "[ ver o pedido ]",
      type: "choicePuzzle",
      puzzle: {
        question: "",
        options: [
          {
            id: "k9",
            label: "o centésimo gol do K9 gelado",
            errorFeedback: ["seria histórico. mas não era isso."],
          },
          {
            id: "neymar",
            label: "Neymar ser convocado",
            errorFeedback: ["aí já seria milagre também. mas não."],
          },
          {
            id: "builder",
            label: "o pedreiro terminar de reformar a casa",
            errorFeedback: [
              "esse talvez demore mais que tudo. mas também não.",
            ],
          },
          {
            id: "proposal-day",
            label: "o dia do pedido",
          },
        ],
        correctOptionId: "proposal-day",
        successFeedback: ["sim.", "o dia do pedido."],
      },
    },
    {
      id: "proposalStart",
      title: "O PEDIDO",
      speaker: "Lucas",
      messages: ["você viu o dia.", "mas não viu tudo", "que veio antes."],
      actionLabel: "[ reviver o pedido ]",
      type: "proposalGallery",
      revelations: [
        {
          id: "idea",
          title: "a ideia já estava comigo.",
          mediaSrc: proposalIdeaImage,
          imageFit: "cover",
          imageLayout: "square",
          imagePosition: "center 58%",
        },
        {
          id: "ring",
          title: "a aliança.",
          mediaSrc: proposalRingImage,
          imageFit: "cover",
          imageLayout: "square",
          imagePosition: "center 50%",
        },
        {
          id: "preparations",
          title: "os preparativos.",
          mediaSrc: proposalPreparationsImage,
          imageFit: "cover",
          imageLayout: "square",
          imagePosition: "center 52%",
        },
        {
          id: "day",
          title: "e então chegou o dia.",
          mediaSrc: proposalDayImage,
          imageFit: "cover",
          imageLayout: "square",
          imagePosition: "center 45%",
        },
      ],
      stories: [
        {
          id: "gallery-welcome",
          mediaSrc: proposalGalleryPhotoWelcome,
          mediaType: "image",
        },
        {
          id: "gallery-video-1901",
          mediaSrc: proposalGalleryVideo1901,
          mediaType: "video",
        },
        {
          id: "gallery-photo-1912",
          mediaSrc: proposalGalleryPhoto1912,
          mediaType: "image",
        },
        {
          id: "gallery-video-1946",
          mediaSrc: proposalGalleryVideo1946,
          mediaType: "video",
        },
        {
          id: "gallery-video-1975",
          mediaSrc: proposalGalleryVideo1975,
          mediaType: "video",
        },
        {
          id: "gallery-photo-2024",
          mediaSrc: proposalGalleryPhoto2024,
          mediaType: "image",
        },
        {
          id: "gallery-video-2056",
          mediaSrc: proposalGalleryVideo2056,
          mediaType: "video",
        },
        {
          id: "gallery-picnic-1",
          mediaSrc: proposalGalleryPhotoPicnic1,
          mediaType: "image",
        },
        {
          id: "gallery-picnic-2",
          mediaSrc: proposalGalleryPhotoPicnic2,
          mediaType: "image",
        },
        {
          id: "gallery-picnic-3",
          mediaSrc: proposalGalleryPhotoPicnic3,
          mediaType: "image",
        },
        {
          id: "gallery-picnic-4",
          mediaSrc: proposalGalleryPhotoPicnic4,
          mediaType: "image",
        },
        {
          id: "gallery-picnic-5",
          mediaSrc: proposalGalleryPhotoPicnic5,
          mediaType: "image",
        },
      ],
    },
    {
      id: "memoryBox",
      title: "CAIXA DE LEMBRANÇAS",
      speaker: "Lucas",
      messages: [
        "depois disso,",
        "a história ficou grande demais",
        "para caber em ordem.",
        "então eu guardei algumas coisas.",
      ],
      actionLabel: "[ abrir caixa ]",
      type: "memoryBox",
      memoryBoxItems: [
        {
          id: "neno-nena",
          title: "Neno & Nena",
          text: ["em algum momento,", "a gente ganhou um idioma próprio."],
          placeholder: "prints, frases e apelidos",
          media: memoryBoxMedia.nenoNena,
        },
        {
          id: "small-things",
          title: "Coisas pequenas",
          text: ["nem tudo que importa", "parece importante para os outros."],
          placeholder: "foto, presente ou detalhe",
          media: memoryBoxMedia.coisasPequenas,
        },
        {
          id: "inside-laughs",
          title: "Risadas que só a gente entende",
          text: [
            "essa parte talvez não faça sentido",
            "para ninguém.",
            "ainda bem.",
          ],
          placeholder: "Kings League, piadas ou áudio",
          media: memoryBoxMedia.risadas,
        },
        {
          id: "what-stayed",
          title: "O que ficou",
          text: [
            "no fim,",
            "o que ficou foi simples:",
            "eu amo caminhar com você.",
          ],
          placeholder: "foto favorita, áudio ou vídeo",
          media: memoryBoxMedia.oQueFicou,
        },
      ],
    },
    {
      id: "musicAchievements",
      title: "TRILHA E CONQUISTAS",
      speaker: "Lucas",
      messages: ["e se tudo isso tivesse uma trilha,", "talvez fosse essa."],
      actionLabel: "[ ler a última parte ]",
      type: "musicAchievements",
      music: {
        title: "Nós Dois",
        artist: "Pedro Valença",
        audioSrc: nosDoisAudio,
        coverSrc: nosDoisCoverImage,
      },
      counterIntroMessages: ["calculando o que já vivemos..."],
      achievements: {
        stats: [
          {
            label: "abraços dados",
            value: "incontáveis",
          },
          {
            label: "de “eu te amo” falados",
            value: "milhares",
          },
          {
            label: "conversas importantes",
            value: "várias",
          },
          {
            label: "orações feitas",
            value: "muitas",
          },
          {
            label: "os momentos guardados",
            value: "todos",
          },
        ],
        locked: [
          "noivado",
          "casamento",
          "nossa casa",
          "nossas viagens",
          "nossa família",
          "envelhecer juntos",
        ],
      },
      closingMessages: [
        "algumas coisas ainda estão bloqueadas.",
        "e tudo bem.",
        "quero viver cada uma",
        "no tempo certo.",
      ],
    },
    {
      id: "letterTransition",
      title: "PARABÉNS AMOR",
      speaker: "Lucas",
      messages: ["você encontrou as partes que faltavam."],
      actionLabel: "[ ler carta completa ]",
      type: "default",
    },
    {
      id: "finalLetter",
      title: "CARTA COMPLETA",
      speaker: null,
      messages: [],
      actionLabel: "[ concluir ]",
      type: "finalLetter",
      letter:
        "Nena,\n\n" +
        "eu comecei essa carta no papel, mas algumas partes dela precisavam ser lembradas antes de serem lidas.\n\n" +
        "Porque quando eu volto para tudo que a gente viveu, eu percebo que a nossa história não começou de uma vez. Ela foi sendo construída nos detalhes. Em conversas simples, em momentos que pareciam pequenos, em decisões que eu guardei comigo, em dias que talvez a gente nem soubesse o quanto seriam importantes.\n\n" +
        "E olhando para tudo isso, uma coisa fica muito clara para mim: você faz sentido na minha vida.\n\n" +
        "Faz sentido nos meus dias, nos meus planos, nas minhas orações, nas minhas risadas e até nas partes que eu ainda estou aprendendo a construir. Você chegou de um jeito leve, mas ficou de um jeito muito real.\n\n" +
        "Eu sou feliz ao seu lado. Feliz por viver nossa história, por lembrar do que Deus já cuidou até aqui, e por pensar em tudo que ainda podemos construir.\n\n" +
        "Relembrar tudo isso só me dá mais certeza de que eu quero continuar. Com calma, com verdade, com Deus no centro, e com você do meu lado.\n\n" +
        "Minha companheira de vida,\n" +
        "eu te amo.\n\n" +
        "Com carinho,\n" +
        "Lucas.",
    },
    {
      id: "ending",
      title: "FIM",
      speaker: null,
      messages: [],
      actionLabel: "[ fim ]",
      type: "ending",
      ending: {
        title: "te amo.",
        lines: ["com carinho,", "Lucas."],
      },
    },
  ],
};

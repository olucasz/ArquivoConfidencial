import { AnimatePresence, motion } from 'framer-motion';
import { Check, LockKeyhole } from 'lucide-react';
import { type FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AchievementGrid } from '../components/AchievementGrid';
import { AppShell } from '../components/AppShell';
import { ChoicePuzzle } from '../components/ChoicePuzzle';
import { ContinueButton } from '../components/ContinueButton';
import { Counter } from '../components/Counter';
import { EndingScreen } from '../components/EndingScreen';
import { FinalLetter } from '../components/FinalLetter';
import { GuidedMessage } from '../components/GuidedMessage';
import { MemoryBox } from '../components/MemoryBox';
import { MemoryCard } from '../components/MemoryCard';
import { MusicPlayer } from '../components/MusicPlayer';
import { StoryGallery } from '../components/StoryGallery';
import { TerminalWindow } from '../components/TerminalWindow';
import { TypewriterText } from '../components/TypewriterText';
import { storyData } from '../data/storyData';
import { useBackgroundMusic } from '../hooks/useBackgroundMusic';

export function Experience() {
  const [hasStarted, setHasStarted] = useState(false);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const feedRef = useRef<HTMLDivElement | null>(null);
  const [visibleMessageCount, setVisibleMessageCount] = useState(1);
  const [completedMessageCount, setCompletedMessageCount] = useState(0);
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordFeedback, setPasswordFeedback] = useState<string[]>([]);
  const [accessGranted, setAccessGranted] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [photoSequenceComplete, setPhotoSequenceComplete] = useState(false);
  const [visibleCardCount, setVisibleCardCount] = useState(0);
  const [revealedCardIds, setRevealedCardIds] = useState<string[]>([]);
  const [checkedItemIds, setCheckedItemIds] = useState<string[]>([]);
  const [visibleAfterMessageCount, setVisibleAfterMessageCount] = useState(0);
  const [completedAfterMessageCount, setCompletedAfterMessageCount] = useState(0);
  const [currentProposalRevealIndex, setCurrentProposalRevealIndex] = useState(0);
  const [proposalSequenceComplete, setProposalSequenceComplete] = useState(false);
  const [storyGalleryOpen, setStoryGalleryOpen] = useState(false);
  const [memoryBoxOpen, setMemoryBoxOpen] = useState(false);
  const [memoryUnlockVisible, setMemoryUnlockVisible] = useState(false);
  const [musicStepIndex, setMusicStepIndex] = useState(0);
  const [visibleCounterIntroCount, setVisibleCounterIntroCount] = useState(0);
  const [completedCounterIntroCount, setCompletedCounterIntroCount] = useState(0);
  const [visibleClosingMessageCount, setVisibleClosingMessageCount] = useState(0);
  const [completedClosingMessageCount, setCompletedClosingMessageCount] = useState(0);
  const backgroundMusicSrc = useMemo(
    () => storyData.scenes.find((storyScene) => storyScene.type === 'musicAchievements')?.music?.audioSrc,
    [],
  );
  const {
    isPlaying: backgroundMusicIsPlaying,
    progress: backgroundMusicProgress,
    stop: stopBackgroundMusic,
    toggle: toggleBackgroundMusic,
  } = useBackgroundMusic(backgroundMusicSrc);

  const scene = storyData.scenes[currentSceneIndex];
  const isPasswordScene = scene.type === 'password';
  const isChoicePuzzleScene = scene.type === 'choicePuzzle';
  const isProposalGalleryScene = scene.type === 'proposalGallery';
  const isMemoryBoxScene = scene.type === 'memoryBox';
  const isMusicAchievementsScene = scene.type === 'musicAchievements';
  const isFinalLetterScene = scene.type === 'finalLetter';
  const isEndingScene = scene.type === 'ending';
  const hasNextScene = currentSceneIndex < storyData.scenes.length - 1;
  const photos = scene.photos ?? [];
  const cards = scene.cards ?? [];
  const checklist = scene.checklist ?? [];
  const revelations = scene.revelations ?? [];
  const stories = scene.stories ?? [];
  const memoryBoxItems = scene.memoryBoxItems ?? [];
  const afterMessages = scene.afterMessages ?? [];
  const counterIntroMessages = scene.counterIntroMessages ?? [];
  const closingMessages = scene.closingMessages ?? [];
  const visibleMessages = useMemo(
    () => scene.messages.slice(0, visibleMessageCount),
    [scene.messages, visibleMessageCount],
  );
  const visibleAfterMessages = useMemo(
    () => afterMessages.slice(0, visibleAfterMessageCount),
    [afterMessages, visibleAfterMessageCount],
  );
  const visibleClosingMessages = useMemo(
    () => closingMessages.slice(0, visibleClosingMessageCount),
    [closingMessages, visibleClosingMessageCount],
  );
  const visibleCounterIntroMessages = useMemo(
    () => counterIntroMessages.slice(0, visibleCounterIntroCount),
    [counterIntroMessages, visibleCounterIntroCount],
  );
  const visibleMemoryCards = useMemo(
    () => (scene.type === 'memoryCards' ? cards.slice(0, visibleCardCount) : []),
    [cards, scene.type, visibleCardCount],
  );
  const allMessagesComplete = completedMessageCount >= scene.messages.length;
  const allCardsRevealed =
    cards.length === 0 || cards.every((card) => revealedCardIds.includes(card.id));
  const allVisibleCardsRevealed =
    visibleMemoryCards.length > 0 &&
    visibleMemoryCards.every((card) => revealedCardIds.includes(card.id));
  const hasMoreMemoryCards =
    scene.type === 'memoryCards' && visibleCardCount > 0 && visibleCardCount < cards.length;
  const allChecklistChecked =
    checklist.length === 0 || checklist.every((item) => checkedItemIds.includes(item));
  const allProposalRevealed = revelations.length === 0 || proposalSequenceComplete;
  const currentProposalReveal = revelations[currentProposalRevealIndex];
  const sceneInteractionComplete =
    scene.type === 'photoSequence'
      ? photoSequenceComplete || photos.length === 0
      : scene.type === 'memoryCards'
        ? allCardsRevealed
        : scene.type === 'checklist'
          ? allChecklistChecked
          : scene.type === 'proposalGallery'
            ? allProposalRevealed
            : true;
  const shouldShowAfterMessages =
    allMessagesComplete && sceneInteractionComplete && afterMessages.length > 0;
  const afterMessagesComplete =
    afterMessages.length === 0 || completedAfterMessageCount >= afterMessages.length;
  const closingMessagesComplete =
    closingMessages.length === 0 || completedClosingMessageCount >= closingMessages.length;
  const counterIntroComplete =
    counterIntroMessages.length === 0 ||
    completedCounterIntroCount >= counterIntroMessages.length;
  const shouldShowMemoryCard =
    scene.type === 'checklist' && afterMessagesComplete && Boolean(scene.memoryCard);
  const shouldShowMemoryUnlock = shouldShowMemoryCard && memoryUnlockVisible;
  const hasChecklistMemoryCard = scene.type === 'checklist' && Boolean(scene.memoryCard);
  const memoryCardStepComplete = !hasChecklistMemoryCard || shouldShowMemoryUnlock;
  const shouldHideSceneMessages = isMemoryBoxScene && memoryBoxOpen;
  const canContinue =
    allMessagesComplete &&
    !isPasswordScene &&
    !isChoicePuzzleScene &&
    !isProposalGalleryScene &&
    !isMemoryBoxScene &&
    !isMusicAchievementsScene &&
    sceneInteractionComplete &&
    afterMessagesComplete &&
    memoryCardStepComplete;

  const goToNextScene = useCallback(() => {
    if (!hasNextScene) {
      return;
    }

    setCurrentSceneIndex((current) => Math.min(current + 1, storyData.scenes.length - 1));
  }, [hasNextScene]);

  const unlockExperience = useCallback(() => {
    if (accessGranted) {
      return;
    }

    setAccessGranted(true);
    setPasswordFeedback(['acesso permitido.', 'era você mesmo.']);

    window.setTimeout(() => {
      goToNextScene();
    }, 1250);
  }, [accessGranted, goToNextScene]);

  useEffect(() => {
    setVisibleMessageCount(scene.messages.length > 0 ? 1 : 0);
    setCompletedMessageCount(0);
    setPasswordFeedback([]);
    setCurrentPhotoIndex(0);
    setPhotoSequenceComplete(false);
    setVisibleCardCount(0);
    setRevealedCardIds([]);
    setCheckedItemIds([]);
    setVisibleAfterMessageCount(0);
    setCompletedAfterMessageCount(0);
    setCurrentProposalRevealIndex(0);
    setProposalSequenceComplete(false);
    setStoryGalleryOpen(false);
    setMemoryBoxOpen(false);
    setMemoryUnlockVisible(false);
    setMusicStepIndex(0);
    setVisibleCounterIntroCount(0);
    setCompletedCounterIntroCount(0);
    setVisibleClosingMessageCount(0);
    setCompletedClosingMessageCount(0);

    if (!isPasswordScene) {
      setUserName('');
      setPassword('');
    }
  }, [isPasswordScene, scene.id, scene.messages.length]);

  const handleMessageComplete = useCallback(
    (messageIndex: number) => {
      const nextCompletedCount = messageIndex + 1;

      setCompletedMessageCount((current) => Math.max(current, nextCompletedCount));
      setVisibleMessageCount((current) => {
        if (messageIndex !== current - 1) {
          return current;
        }

        return Math.min(current + 1, scene.messages.length);
      });
    },
    [scene.messages.length],
  );

  const handleAfterMessageComplete = useCallback(
    (messageIndex: number) => {
      const nextCompletedCount = messageIndex + 1;

      setCompletedAfterMessageCount((current) => Math.max(current, nextCompletedCount));
      setVisibleAfterMessageCount((current) => {
        if (messageIndex !== current - 1) {
          return current;
        }

        return Math.min(current + 1, afterMessages.length);
      });
    },
    [afterMessages.length],
  );

  const handleCounterIntroComplete = useCallback(
    (messageIndex: number) => {
      const nextCompletedCount = messageIndex + 1;

      setCompletedCounterIntroCount((current) => Math.max(current, nextCompletedCount));
      setVisibleCounterIntroCount((current) => {
        if (messageIndex !== current - 1) {
          return current;
        }

        return Math.min(current + 1, counterIntroMessages.length);
      });
    },
    [counterIntroMessages.length],
  );

  const handleClosingMessageComplete = useCallback(
    (messageIndex: number) => {
      const nextCompletedCount = messageIndex + 1;

      setCompletedClosingMessageCount((current) => Math.max(current, nextCompletedCount));
      setVisibleClosingMessageCount((current) => {
        if (messageIndex !== current - 1) {
          return current;
        }

        return Math.min(current + 1, closingMessages.length);
      });
    },
    [closingMessages.length],
  );

  useEffect(() => {
    if (!shouldShowAfterMessages) {
      return;
    }

    setVisibleAfterMessageCount((current) => (current === 0 ? 1 : current));
  }, [shouldShowAfterMessages]);

  useEffect(() => {
    if (scene.type !== 'memoryCards' || !allMessagesComplete || cards.length === 0) {
      return;
    }

    setVisibleCardCount((current) => (current === 0 ? 1 : current));
  }, [allMessagesComplete, cards.length, scene.type]);

  useEffect(() => {
    if (
      !isMusicAchievementsScene ||
      !allMessagesComplete ||
      musicStepIndex < 1 ||
      counterIntroMessages.length === 0
    ) {
      return;
    }

    setVisibleCounterIntroCount((current) => (current === 0 ? 1 : current));
  }, [
    allMessagesComplete,
    counterIntroMessages.length,
    isMusicAchievementsScene,
    musicStepIndex,
  ]);

  useEffect(() => {
    if (!shouldShowMemoryCard) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setMemoryUnlockVisible(true);
    }, 550);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [shouldShowMemoryCard]);

  useEffect(() => {
    const feed = feedRef.current;

    if (!feed) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      feed.scrollTo({
        top: feed.scrollHeight,
        behavior: 'smooth',
      });
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [
    currentSceneIndex,
    visibleMessageCount,
    completedMessageCount,
    visibleAfterMessageCount,
    completedAfterMessageCount,
    visibleClosingMessageCount,
    completedClosingMessageCount,
    currentPhotoIndex,
    photoSequenceComplete,
    visibleCardCount,
    revealedCardIds.length,
    checkedItemIds.length,
    currentProposalRevealIndex,
    proposalSequenceComplete,
    memoryBoxOpen,
    memoryUnlockVisible,
    musicStepIndex,
    visibleCounterIntroCount,
    completedCounterIntroCount,
    passwordFeedback.length,
  ]);

  useEffect(() => {
    if (!isMusicAchievementsScene || !allMessagesComplete || musicStepIndex < 5) {
      return;
    }

    setVisibleClosingMessageCount((current) => (current === 0 ? 1 : current));
  }, [allMessagesComplete, isMusicAchievementsScene, musicStepIndex]);

  useEffect(() => {
    if (!isEndingScene) {
      return;
    }

    stopBackgroundMusic();
  }, [isEndingScene, stopBackgroundMusic]);

  const handlePasswordSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (accessGranted) {
      return;
    }

    const nameMatches =
      userName.trim().toLocaleLowerCase('pt-BR') ===
      storyData.userNameExpected.toLocaleLowerCase('pt-BR');
    const passwordMatches = password.trim() === storyData.passwordExpected;

    if (nameMatches && passwordMatches) {
      unlockExperience();
      return;
    }

    setPasswordFeedback(['essa chave não abriu o arquivo.', 'confere de novo.']);
  };

  const handleContinue = () => {
    goToNextScene();
  };

  const handlePhotoNext = () => {
    if (currentPhotoIndex >= photos.length - 1) {
      setPhotoSequenceComplete(true);
      return;
    }

    setCurrentPhotoIndex((current) => Math.min(current + 1, photos.length - 1));
  };

  const handleRevealCard = (cardId: string) => {
    setRevealedCardIds((current) =>
      current.includes(cardId) ? current : [...current, cardId],
    );
  };

  const handleNextMemoryCard = () => {
    setVisibleCardCount((current) => Math.min(current + 1, cards.length));
  };

  const handleChecklistItem = (item: string) => {
    setCheckedItemIds((current) => (current.includes(item) ? current : [...current, item]));
  };

  const handleOpenStoryGallery = () => {
    if (stories.length === 0) {
      handleContinue();
      return;
    }

    setStoryGalleryOpen(true);
  };

  const handleProposalRevealNext = () => {
    if (currentProposalRevealIndex >= revelations.length - 1) {
      setProposalSequenceComplete(true);
      return;
    }

    setCurrentProposalRevealIndex((current) => Math.min(current + 1, revelations.length - 1));
  };

  const handleOpenMemoryBox = () => {
    setMemoryBoxOpen(true);
  };

  const handleMusicStepNext = () => {
    setMusicStepIndex((current) => Math.min(current + 1, 5));
  };

  if (!hasStarted) {
    return (
      <AppShell>
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="w-full border border-terminal-green/70 bg-terminal-panel/90 p-5 shadow-terminal sm:p-6"
        >
          <div className="space-y-8">
            <header className="space-y-4">
              <div className="flex items-center gap-2 text-terminal-lime">
                <LockKeyhole className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
                <span className="font-mono text-[0.68rem] uppercase tracking-[0.28em]">
                  arquivo privado
                </span>
              </div>

              <div className="space-y-3">
                <p className="font-mono text-xs uppercase tracking-[0.24em] text-terminal-muted">
                  registro 000
                </p>
                <h1 className="font-pixel text-5xl leading-none text-terminal-lime sm:text-6xl">
                  ARQUIVO CONFIDENCIAL
                </h1>
              </div>
            </header>

            <GuidedMessage speaker="sistema">
              <TypewriterText text="inicializando..." speed={40} />
            </GuidedMessage>

            <ContinueButton onClick={() => setHasStarted(true)}>[ continuar ]</ContinueButton>
          </div>
        </motion.section>
      </AppShell>
    );
  }

  if (storyGalleryOpen && isProposalGalleryScene) {
    return (
      <AppShell>
        <StoryGallery stories={stories} onComplete={handleContinue} />
      </AppShell>
    );
  }

  if (isFinalLetterScene && scene.letter) {
    return (
      <AppShell>
        <FinalLetter
          letter={scene.letter}
          actionLabel={scene.actionLabel}
          onComplete={handleContinue}
        />
      </AppShell>
    );
  }

  if (isEndingScene && scene.ending) {
    return (
      <AppShell>
        <EndingScreen title={scene.ending.title} lines={scene.ending.lines} />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <TerminalWindow title="arquivo reservado">
        <AnimatePresence mode="wait">
          <motion.div
            key={scene.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="flex min-h-0 flex-1 flex-col overflow-x-hidden"
          >
            <div
              ref={feedRef}
              className="terminal-feed no-scrollbar min-h-0 flex-1 space-y-8 overflow-y-auto overflow-x-hidden p-5 sm:p-6"
            >
            <header className="space-y-4">
              <div className="flex items-center gap-2 text-terminal-lime">
                <LockKeyhole className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
                <span className="font-mono text-[0.68rem] uppercase tracking-[0.28em]">
                  acesso restrito
                </span>
              </div>

              <div className="space-y-3">
                <p className="font-mono text-xs uppercase tracking-[0.24em] text-terminal-muted">
                  registro {String(currentSceneIndex + 1).padStart(3, '0')}
                </p>
                <h1 className="font-pixel text-5xl leading-none text-terminal-lime sm:text-6xl">
                  {scene.title}
                </h1>
              </div>
            </header>

            {!shouldHideSceneMessages ? (
              <motion.section layout className="space-y-5" aria-live="polite">
                {visibleMessages.map((message, index) => {
                const isCurrentMessage = index === visibleMessages.length - 1;
                const messageIsComplete = completedMessageCount > index;

                return (
                  <motion.div
                    key={`${scene.id}-${index}`}
                    layout
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.28, ease: 'easeOut' }}
                  >
                    <GuidedMessage speaker={scene.speaker}>
                      <TypewriterText
                        text={message}
                        speed={34}
                        startDelay={index === 0 ? 160 : 580}
                        showCursor={isCurrentMessage && !messageIsComplete}
                        onComplete={() => handleMessageComplete(index)}
                      />
                    </GuidedMessage>
                  </motion.div>
                );
                })}
              </motion.section>
            ) : null}

            <AnimatePresence mode="popLayout">
              {allMessagesComplete && scene.type === 'photoSequence' && !photoSequenceComplete ? (
                <motion.div
                  key={`photo-${currentPhotoIndex}`}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.32, ease: 'easeOut' }}
                  className="space-y-4"
                >
                  <MemoryCard
                    title={`pista ${currentPhotoIndex + 1}`}
                    text={photos[currentPhotoIndex]?.caption}
                    imageSrc={photos[currentPhotoIndex]?.imageSrc}
                    imageAlt={photos[currentPhotoIndex]?.caption}
                    imageFit={photos[currentPhotoIndex]?.imageFit}
                    imageLayout={photos[currentPhotoIndex]?.imageLayout}
                    imagePosition={photos[currentPhotoIndex]?.imagePosition}
                    placeholderLabel="foto aqui"
                  />

                  <ContinueButton onClick={handlePhotoNext}>[ próxima ]</ContinueButton>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <AnimatePresence>
              {allMessagesComplete && scene.type === 'memoryCards' ? (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.32, ease: 'easeOut' }}
                  className="space-y-3"
                >
                  {visibleMemoryCards.map((card, index) => {
                    const isRevealed = revealedCardIds.includes(card.id);

                    return (
                      <motion.button
                        key={card.id}
                        layout
                        type="button"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.24, delay: index * 0.04, ease: 'easeOut' }}
                        onClick={() => handleRevealCard(card.id)}
                        className="w-full border border-terminal-green/35 bg-terminal-black/45 p-4 text-left transition duration-200 hover:border-terminal-lime hover:bg-terminal-green/10 focus:outline-none focus:ring-2 focus:ring-terminal-lime/60"
                      >
                        <span className="block font-pixel text-3xl leading-none text-terminal-lime">
                          {card.title}
                        </span>

                        <AnimatePresence>
                          {isRevealed ? (
                            <motion.span
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -4 }}
                              className="mt-3 block font-mono text-sm leading-6 text-terminal-white/80"
                            >
                              {card.text ?? 'guardado para depois.'}
                            </motion.span>
                          ) : (
                            <motion.span className="mt-3 block font-mono text-xs uppercase tracking-[0.18em] text-terminal-muted">
                              tocar para abrir
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </motion.button>
                    );
                  })}

                  {allVisibleCardsRevealed && hasMoreMemoryCards ? (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                    >
                      <ContinueButton onClick={handleNextMemoryCard}>[ continuar ]</ContinueButton>
                    </motion.div>
                  ) : null}
                </motion.div>
              ) : null}
            </AnimatePresence>

            <AnimatePresence>
              {allMessagesComplete && scene.type === 'checklist' ? (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.32, ease: 'easeOut' }}
                  className="space-y-2 border border-terminal-green/30 bg-terminal-black/40 p-4"
                >
                  {scene.checklistTitle ? (
                    <p className="pb-2 font-pixel text-3xl leading-none text-terminal-lime">
                      {scene.checklistTitle}
                    </p>
                  ) : null}

                  {checklist.map((item, index) => {
                    const isChecked = checkedItemIds.includes(item);

                    return (
                      <motion.button
                        key={item}
                        layout
                        type="button"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.22, delay: index * 0.04, ease: 'easeOut' }}
                        onClick={() => handleChecklistItem(item)}
                        aria-pressed={isChecked}
                        className="flex w-full items-center gap-3 border border-transparent p-2 text-left font-mono text-sm text-terminal-white/85 transition duration-200 hover:border-terminal-green/35 hover:bg-terminal-green/10 focus:outline-none focus:ring-2 focus:ring-terminal-lime/50"
                      >
                        <span
                          className={`flex h-5 w-5 items-center justify-center border transition ${
                            isChecked
                              ? 'border-terminal-lime bg-terminal-lime text-terminal-black'
                              : 'border-terminal-green/45 text-transparent'
                          }`}
                        >
                          <Check className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                        </span>
                        <span>{item}</span>
                      </motion.button>
                    );
                  })}
                </motion.div>
              ) : null}
            </AnimatePresence>

            {shouldShowAfterMessages ? (
              <motion.section layout className="space-y-5" aria-live="polite">
                {visibleAfterMessages.map((message, index) => {
                  const isCurrentMessage = index === visibleAfterMessages.length - 1;
                  const messageIsComplete = completedAfterMessageCount > index;

                  return (
                    <motion.div
                      key={`${scene.id}-after-${index}`}
                      layout
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.28, ease: 'easeOut' }}
                    >
                      <GuidedMessage speaker={scene.speaker}>
                        <TypewriterText
                          text={message}
                          speed={34}
                          startDelay={index === 0 ? 220 : 580}
                          showCursor={isCurrentMessage && !messageIsComplete}
                          onComplete={() => handleAfterMessageComplete(index)}
                        />
                      </GuidedMessage>
                    </motion.div>
                  );
                })}
              </motion.section>
            ) : null}

            {shouldShowMemoryCard && scene.memoryCard ? (
              <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32, ease: 'easeOut' }}
              >
                <MemoryCard
                  title={scene.memoryCard.title}
                  text={scene.memoryCard.text}
                  imageSrc={scene.memoryCard.imageSrc}
                  imageAlt={scene.memoryCard.title}
                  imageFit={scene.memoryCard.imageFit}
                  imageLayout={scene.memoryCard.imageLayout}
                  imagePosition={scene.memoryCard.imagePosition}
                  placeholderLabel="foto aqui"
                />
              </motion.div>
            ) : null}

            {shouldShowMemoryUnlock ? (
              <motion.div
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32, ease: 'easeOut' }}
                className="border border-terminal-lime/40 bg-terminal-lime/10 p-4 text-center"
              >
                <p className="font-pixel text-4xl leading-none text-terminal-lime">
                  memória desbloqueada.
                </p>
              </motion.div>
            ) : null}

            {allMessagesComplete && isChoicePuzzleScene && scene.puzzle ? (
              <ChoicePuzzle
                question={scene.puzzle.question}
                options={scene.puzzle.options}
                correctOptionId={scene.puzzle.correctOptionId}
                successFeedback={scene.puzzle.successFeedback}
                generalErrorFeedback={scene.puzzle.generalErrorFeedback}
                actionLabel={scene.actionLabel}
                onContinue={handleContinue}
              />
            ) : null}

            {allMessagesComplete && isProposalGalleryScene ? (
              <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32, ease: 'easeOut' }}
                className="space-y-3"
              >
                <AnimatePresence mode="wait">
                  {currentProposalReveal ? (
                    <motion.div
                      key={currentProposalReveal.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.26, ease: 'easeOut' }}
                    >
                      <MemoryCard
                        title={currentProposalReveal.title}
                        imageSrc={currentProposalReveal.mediaSrc}
                        imageAlt={currentProposalReveal.title}
                        imageFit={currentProposalReveal.imageFit}
                        imageLayout={currentProposalReveal.imageLayout}
                        imagePosition={currentProposalReveal.imagePosition}
                        placeholderLabel="foto aqui"
                      />
                    </motion.div>
                  ) : null}
                </AnimatePresence>

                {!allProposalRevealed ? (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  >
                    <ContinueButton onClick={handleProposalRevealNext}>[ próxima ]</ContinueButton>
                  </motion.div>
                ) : (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  >
                    <ContinueButton onClick={handleOpenStoryGallery}>
                      {scene.actionLabel}
                    </ContinueButton>
                  </motion.div>
                )}
              </motion.div>
            ) : null}

            {allMessagesComplete && isMemoryBoxScene ? (
              <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32, ease: 'easeOut' }}
                className="space-y-4"
              >
                {!memoryBoxOpen ? (
                  <ContinueButton onClick={handleOpenMemoryBox}>{scene.actionLabel}</ContinueButton>
                ) : (
                  <MemoryBox items={memoryBoxItems} onComplete={handleContinue} />
                )}
              </motion.div>
            ) : null}

            {allMessagesComplete && isMusicAchievementsScene ? (
              <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32, ease: 'easeOut' }}
                className="space-y-6"
              >
                {scene.music ? (
                  <MusicPlayer
                    title={scene.music.title}
                    artist={scene.music.artist}
                    audioSrc={scene.music.audioSrc}
                    coverSrc={scene.music.coverSrc}
                    isPlaying={backgroundMusicIsPlaying}
                    progress={backgroundMusicProgress}
                    onToggle={toggleBackgroundMusic}
                  />
                ) : null}

                {visibleCounterIntroMessages.length > 0 ? (
                  <motion.section layout className="space-y-5" aria-live="polite">
                    {visibleCounterIntroMessages.map((message, index) => {
                      const isCurrentMessage =
                        index === visibleCounterIntroMessages.length - 1;
                      const messageIsComplete = completedCounterIntroCount > index;

                      return (
                        <motion.div
                          key={`${scene.id}-counter-${index}`}
                          layout
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.28, ease: 'easeOut' }}
                        >
                          <GuidedMessage speaker={scene.speaker}>
                            <TypewriterText
                              text={message}
                              speed={34}
                              startDelay={index === 0 ? 220 : 580}
                              showCursor={isCurrentMessage && !messageIsComplete}
                              onComplete={() => handleCounterIntroComplete(index)}
                            />
                          </GuidedMessage>
                        </motion.div>
                      );
                    })}
                  </motion.section>
                ) : null}

                {musicStepIndex >= 2 ? (
                  <Counter startDate={storyData.relationshipStartDate} />
                ) : null}

                {musicStepIndex >= 3 && scene.achievements ? (
                  <AchievementGrid
                    stats={scene.achievements.stats}
                    locked={scene.achievements.locked}
                    showLocked={false}
                  />
                ) : null}

                {musicStepIndex >= 4 && scene.achievements ? (
                  <AchievementGrid
                    stats={scene.achievements.stats}
                    locked={scene.achievements.locked}
                    showStats={false}
                  />
                ) : null}

                {visibleClosingMessages.length > 0 ? (
                  <motion.section layout className="space-y-5" aria-live="polite">
                    {visibleClosingMessages.map((message, index) => {
                      const isCurrentMessage = index === visibleClosingMessages.length - 1;
                      const messageIsComplete = completedClosingMessageCount > index;

                      return (
                        <motion.div
                          key={`${scene.id}-closing-${index}`}
                          layout
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.28, ease: 'easeOut' }}
                        >
                          <GuidedMessage speaker={scene.speaker}>
                            <TypewriterText
                              text={message}
                              speed={34}
                              startDelay={index === 0 ? 220 : 580}
                              showCursor={isCurrentMessage && !messageIsComplete}
                              onComplete={() => handleClosingMessageComplete(index)}
                            />
                          </GuidedMessage>
                        </motion.div>
                      );
                    })}
                  </motion.section>
                ) : null}

                {musicStepIndex < 5 &&
                (musicStepIndex !== 1 || counterIntroComplete) ? (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  >
                    <ContinueButton onClick={handleMusicStepNext}>[ continuar ]</ContinueButton>
                  </motion.div>
                ) : null}

                {musicStepIndex >= 5 && closingMessagesComplete ? (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  >
                    <ContinueButton onClick={handleContinue}>{scene.actionLabel}</ContinueButton>
                  </motion.div>
                ) : null}
              </motion.div>
            ) : null}

            <AnimatePresence>
              {allMessagesComplete && isPasswordScene ? (
                <motion.form
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="space-y-4"
                  onSubmit={handlePasswordSubmit}
                >
                  <label className="block space-y-2">
                    <span className="font-mono text-[0.72rem] uppercase tracking-[0.22em] text-terminal-muted">
                      nome
                    </span>
                    <input
                      type="text"
                      value={userName}
                      autoComplete="off"
                      disabled={accessGranted}
                      onChange={(event) => setUserName(event.target.value)}
                      className="w-full border border-terminal-green/45 bg-terminal-black/70 px-4 py-3 font-mono text-base text-terminal-white outline-none transition placeholder:text-terminal-muted/60 focus:border-terminal-lime focus:ring-2 focus:ring-terminal-lime/30"
                      placeholder="digite seu nome"
                    />
                  </label>

                  <label className="block space-y-2">
                    <span className="font-mono text-[0.72rem] uppercase tracking-[0.22em] text-terminal-muted">
                      chave de acesso
                    </span>
                    <input
                      type="password"
                      value={password}
                      autoComplete="off"
                      disabled={accessGranted}
                      onChange={(event) => setPassword(event.target.value)}
                      className="w-full border border-terminal-green/45 bg-terminal-black/70 px-4 py-3 font-mono text-base text-terminal-white outline-none transition placeholder:text-terminal-muted/60 focus:border-terminal-lime focus:ring-2 focus:ring-terminal-lime/30"
                      placeholder="digite aqui"
                    />
                  </label>

                  {passwordFeedback.length > 0 ? (
                    <motion.p
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-1 font-mono text-sm text-terminal-muted"
                    >
                      {passwordFeedback.map((line) => (
                        <span key={line} className="block">
                          {line}
                        </span>
                      ))}
                    </motion.p>
                  ) : null}

                  <ContinueButton type="submit" disabled={accessGranted}>
                    {scene.actionLabel}
                  </ContinueButton>
                </motion.form>
              ) : null}
            </AnimatePresence>

            {canContinue && hasNextScene ? (
              <motion.div
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <ContinueButton onClick={handleContinue}>{scene.actionLabel}</ContinueButton>
              </motion.div>
            ) : null}
            </div>
          </motion.div>
        </AnimatePresence>
      </TerminalWindow>
    </AppShell>
  );
}

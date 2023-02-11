import { Container, Stack } from "@chakra-ui/react";
import React from "react";
import type { ComponentWithAuth } from "../../../components/auth-component";
import { useSet } from "../../../hooks/use-set";
import { CreateLearnData } from "../../../modules/create-learn-data";
import { HydrateSetData } from "../../../modules/hydrate-set-data";
import { ActionBar } from "../../../modules/learn/action-bar";
import { CompletedView } from "../../../modules/learn/completed-view";
import { InteractionCard } from "../../../modules/learn/interaction-card";
import { RoundSummary } from "../../../modules/learn/round-summary";
import { Titlebar } from "../../../modules/learn/titlebar";
import { useLearnContext } from "../../../stores/use-learn-store";
import { api } from "../../../utils/api";

const Learn: ComponentWithAuth = () => {
  return (
    <HydrateSetData>
      <CreateLearnData>
        <Container maxW="4xl">
          <Stack spacing={8}>
            <Titlebar />
            <LearnContainer />
          </Stack>
        </Container>
        <ActionBar />
      </CreateLearnData>
    </HydrateSetData>
  );
};

const LearnContainer = () => {
  const { id } = useSet();
  const completed = useLearnContext((s) => s.completed);
  const roundSummary = useLearnContext((s) => s.roundSummary);

  const completeRound = api.experience.completeRound.useMutation();

  React.useEffect(() => {
    if (!roundSummary) return;

    void (async () =>
      await completeRound.mutateAsync({
        studySetId: id,
      }))();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundSummary, id]);

  if (completed) return <CompletedView />;
  if (roundSummary) return <RoundSummary />;
  return <InteractionCard />;
};

Learn.authenticationEnabled = true;

export default Learn;

export { getServerSideProps } from "../../../components/chakra";

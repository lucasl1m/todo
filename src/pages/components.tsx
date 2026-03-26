import Badge from "../components/badge";
import Button from "../components/button";
import ButtonIcon from "../components/button-icon";
import Card from "../components/card";
import Checkbox from "../components/checkbox";
import Container from "../components/container";
import Icon from "../components/icon";
import InputText from "../components/input";
import Skeleton from "../components/skeleton";
import Text from "../components/text";
import TrashIcon from "../assets/icons/trash.svg?react";
import PencilIcon from "../assets/icons/pencil.svg?react";
import Spinner from "../assets/icons/spinner.svg?react";


export default function PageComponents() {
  return (
    <Container>
      <div className="grid gap-6">
        <div className="flex flex-col gap-1">
          <Text variant="body-sm-bold">Ola mundo</Text>
          <Text variant="body-md">Ola mundo</Text>
          <Text variant="body-md-bold">Ola mundo</Text>
        </div>

        <div className="flex gap-1">
          <Icon svg={TrashIcon} className="fill-green-base" />
          <Icon svg={PencilIcon} className="fill-green-base" />
          <Icon svg={Spinner} animate={"spin"} />
        </div>

        <div className="flex gap-2">
          <Badge variant="primary">5</Badge>
          <Badge variant="secondary">10</Badge>
          <Badge variant="primary" loading />
        </div>

        <div className="flex gap-2">
          <Button variant="primary" icon={TrashIcon}>
            Excluir
          </Button>
        </div>

        <div className="flex gap-2">
          <ButtonIcon variant="primary" icon={TrashIcon} />
          <ButtonIcon variant="secondary" icon={PencilIcon} />
          <ButtonIcon variant="tertiary" icon={Spinner} />
          <ButtonIcon variant="tertiary" icon={Spinner} loading />
        </div>

        <div>
          <InputText placeholder="Digite algo..." />
        </div>

        <div className="flex gap-2">
          <Checkbox />
          <Checkbox disabled />
          <Checkbox defaultChecked />
          <Checkbox loading />
        </div>

        <div>
          <Card size="md">
            <Text variant="body-md-bold">Card Title</Text>
          </Card>
        </div>

        <div className="space-y-2">
          <Skeleton className="h-6" />
          <Skeleton className="h-4 w-80" />
          <Skeleton className="w-90 h-4" />
        </div>
      </div>
    </Container>
  )
}
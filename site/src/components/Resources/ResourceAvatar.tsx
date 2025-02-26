import Avatar from "@material-ui/core/Avatar"
import { makeStyles } from "@material-ui/core/styles"
import { FC } from "react"
import { WorkspaceResource } from "../../api/typesGenerated"

const FALLBACK_ICON = "/icon/widgets.svg"

// NOTE @jsjoeio, @BrunoQuaresma
// These resources (i.e. docker_image, kubernetes_deployment) map to Terraform
// resource types. These are the most used ones and are based on user usage.
// We may want to update from time-to-time.
const BUILT_IN_ICON_PATHS: {
  [resourceType: WorkspaceResource["type"]]: string
} = {
  docker_volume: "/icon/folder.svg",
  docker_container: "/icon/memory.svg",
  docker_image: "/icon/image.svg",
  kubernetes_persistent_volume_claim: "/icon/folder.svg",
  kubernetes_pod: "/icon/memory.svg",
  google_compute_disk: "/icon/folder.svg",
  google_compute_instance: "/icon/memory.svg",
  aws_instance: "/icon/memory.svg",
  kubernetes_deployment: "/icon/memory.svg",
  null_resource: FALLBACK_ICON,
}

const getIconPathResource = (resourceType: string): string => {
  if (resourceType in BUILT_IN_ICON_PATHS) {
    return BUILT_IN_ICON_PATHS[resourceType]
  }

  return FALLBACK_ICON
}

export type ResourceAvatarProps = { resource: WorkspaceResource }

export const ResourceAvatar: FC<ResourceAvatarProps> = ({ resource }) => {
  const hasIcon = resource.icon && resource.icon !== ""
  const avatarSrc = hasIcon ? resource.icon : getIconPathResource(resource.type)
  const styles = useStyles()

  return <Avatar className={styles.resourceAvatar} src={avatarSrc} />
}

const useStyles = makeStyles((theme) => ({
  resourceAvatar: {
    backgroundColor: theme.palette.divider,

    "& img": {
      width: 18,
      height: 18,
    },
  },
}))

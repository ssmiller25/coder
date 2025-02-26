import { makeStyles } from "@material-ui/core/styles"
import { Margins } from "components/Margins/Margins"
import { Stack } from "components/Stack/Stack"
import { Sidebar } from "./Sidebar"
import {
  createContext,
  PropsWithChildren,
  Suspense,
  useContext,
  useEffect,
  FC,
} from "react"
import { useActor } from "@xstate/react"
import { XServiceContext } from "xServices/StateContext"
import { Loader } from "components/Loader/Loader"
import { DeploymentConfig } from "api/typesGenerated"

type DeploySettingsContextValue = { deploymentConfig: DeploymentConfig }

const DeploySettingsContext = createContext<
  DeploySettingsContextValue | undefined
>(undefined)

export const useDeploySettings = (): DeploySettingsContextValue => {
  const context = useContext(DeploySettingsContext)
  if (!context) {
    throw new Error(
      "useDeploySettings should be used inside of DeploySettingsLayout",
    )
  }
  return context
}

export const DeploySettingsLayout: FC<PropsWithChildren> = ({ children }) => {
  const xServices = useContext(XServiceContext)
  const [state, send] = useActor(xServices.deploymentConfigXService)
  const styles = useStyles()
  const { deploymentConfig } = state.context

  useEffect(() => {
    if (state.matches("idle")) {
      send("LOAD")
    }
  }, [send, state])

  return (
    <Margins>
      <Stack className={styles.wrapper} direction="row" spacing={6}>
        <Sidebar />
        <main className={styles.content}>
          {deploymentConfig ? (
            <DeploySettingsContext.Provider
              value={{ deploymentConfig: deploymentConfig }}
            >
              <Suspense fallback={<Loader />}>{children}</Suspense>
            </DeploySettingsContext.Provider>
          ) : (
            <Loader />
          )}
        </main>
      </Stack>
    </Margins>
  )
}

const useStyles = makeStyles((theme) => ({
  wrapper: {
    padding: theme.spacing(6, 0),
  },

  content: {
    maxWidth: 800,
    width: "100%",
  },
}))

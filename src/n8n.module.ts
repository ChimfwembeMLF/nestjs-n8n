import { type DynamicModule, Module, type Provider } from "@nestjs/common"
import { HttpModule } from "@nestjs/axios"
import type {
  N8nModuleOptions,
  N8nModuleAsyncOptions,
  N8nOptionsFactory,
} from "./interfaces/n8n-module-options.interface"
import { N8N_MODULE_OPTIONS } from "./constants/n8n.constants"
import { validateN8nConfiguration } from "./utils/config-validator"
import { N8nClientService } from "./services/n8n-client.service"
import { WebhookValidationGuard } from "./guards/webhook-validation.guard"
import { N8nController } from "./controllers/n8n.controller"

@Module({})
export class N8nModule {
  /**
   * Register the N8n module synchronously
   */
  static forRoot(options: N8nModuleOptions): DynamicModule {
    // Validate configuration synchronously (without connection test)
    const syncOptions = { ...options, validateConnection: false }
    validateN8nConfiguration(syncOptions).catch(error => {
      console.error('N8N Configuration Error:', error.message)
      throw error
    })

    const controllers = options.enableSwaggerController ? [N8nController] : []
    
    return {
      module: N8nModule,
      imports: [HttpModule],
      controllers,
      providers: [
        {
          provide: N8N_MODULE_OPTIONS,
          useValue: options,
        },
        N8nClientService,
        WebhookValidationGuard,
      ],
      exports: [
        N8nClientService,
        WebhookValidationGuard,
      ],
      global: false,
    }
  }

  /**
   * Register the N8n module asynchronously
   */
  static forRootAsync(options: N8nModuleAsyncOptions & { enableSwaggerController?: boolean }): DynamicModule {
    const controllers = options.enableSwaggerController ? [N8nController] : []
    
    return {
      module: N8nModule,
      imports: [...(options.imports || []), HttpModule],
      controllers,
      providers: [
        ...this.createAsyncProviders(options),
        N8nClientService,
        WebhookValidationGuard,
      ],
      exports: [
        N8nClientService,
        WebhookValidationGuard,
      ],
      global: false,
    }
  }

  private static createAsyncProviders(options: N8nModuleAsyncOptions): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)]
    }

    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass!,
        useClass: options.useClass!,
      },
    ]
  }

  private static createAsyncOptionsProvider(options: N8nModuleAsyncOptions): Provider {
    if (options.useFactory) {
      return {
        provide: N8N_MODULE_OPTIONS,
        useFactory: async (...args: any[]) => {
          const config = await options.useFactory!(...args)
          await validateN8nConfiguration(config)
          return config
        },
        inject: options.inject || [],
      }
    }

    return {
      provide: N8N_MODULE_OPTIONS,
      useFactory: async (optionsFactory: N8nOptionsFactory) => {
        const config = await optionsFactory.createN8nOptions()
        await validateN8nConfiguration(config)
        return config
      },
      inject: [options.useExisting || options.useClass!],
    }
  }
}

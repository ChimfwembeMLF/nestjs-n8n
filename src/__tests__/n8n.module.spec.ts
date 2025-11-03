import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { N8nModule } from '../n8n.module';
import { N8nClientService } from '../services/n8n-client.service';
import { WebhookValidationGuard } from '../guards/webhook-validation.guard';
import { N8nController } from '../controllers/n8n.controller';

describe('N8nModule', () => {
  describe('forRoot', () => {
    let module: TestingModule;

    afterEach(async () => {
      if (module) {
        await module.close();
      }
    });

    it('should create module with basic configuration', async () => {
      module = await Test.createTestingModule({
        imports: [
          N8nModule.forRoot({
            baseUrl: 'http://localhost:5678',
            apiKey: 'test-api-key',
            validateConnection: false,
          }),
        ],
      }).compile();

      const n8nClientService = module.get<N8nClientService>(N8nClientService);
      expect(n8nClientService).toBeDefined();
    });

    it('should create module with Swagger controller enabled', async () => {
      module = await Test.createTestingModule({
        imports: [
          N8nModule.forRoot({
            baseUrl: 'http://localhost:5678',
            apiKey: 'test-api-key',
            enableSwaggerController: true,
            validateConnection: false,
          }),
        ],
      }).compile();

      const n8nClientService = module.get<N8nClientService>(N8nClientService);
      const controller = module.get<N8nController>(N8nController);
      
      expect(n8nClientService).toBeDefined();
      expect(controller).toBeDefined();
    });

    it('should export N8nClientService', async () => {
      module = await Test.createTestingModule({
        imports: [
          N8nModule.forRoot({
            baseUrl: 'http://localhost:5678',
            apiKey: 'test-api-key',
            validateConnection: false,
          }),
        ],
      }).compile();

      const exportedService = module.get<N8nClientService>(N8nClientService);
      expect(exportedService).toBeDefined();
      expect(exportedService).toBeInstanceOf(N8nClientService);
    });

    it('should export WebhookValidationGuard', async () => {
      module = await Test.createTestingModule({
        imports: [
          N8nModule.forRoot({
            baseUrl: 'http://localhost:5678',
            apiKey: 'test-api-key',
            validateConnection: false,
          }),
        ],
      }).compile();

      const guard = module.get<WebhookValidationGuard>(WebhookValidationGuard);
      expect(guard).toBeDefined();
      expect(guard).toBeInstanceOf(WebhookValidationGuard);
    });
  });

  describe('forRootAsync', () => {
    let module: TestingModule;

    afterEach(async () => {
      if (module) {
        await module.close();
      }
    });

    it('should create module with async configuration using useFactory', async () => {
      module = await Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({
            envFilePath: [],
            load: [
              () => ({
                N8N_BASE_URL: 'http://localhost:5678',
                N8N_API_KEY: 'test-api-key',
              }),
            ],
          }),
          N8nModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
              baseUrl: configService.get('N8N_BASE_URL', 'http://localhost:5678'),
              apiKey: configService.get('N8N_API_KEY', 'default-key'),
              validateConnection: false,
            }),
            inject: [ConfigService],
          }),
        ],
      }).compile();

      const n8nClientService = module.get<N8nClientService>(N8nClientService);
      expect(n8nClientService).toBeDefined();
    });

    it('should create module with async configuration and Swagger controller', async () => {
      module = await Test.createTestingModule({
        imports: [
          N8nModule.forRootAsync({
            enableSwaggerController: true,
            useFactory: () => ({
              baseUrl: 'http://localhost:5678',
              apiKey: 'test-api-key',
              validateConnection: false,
            }),
          }),
        ],
      }).compile();

      const n8nClientService = module.get<N8nClientService>(N8nClientService);
      const controller = module.get<N8nController>(N8nController);
      
      expect(n8nClientService).toBeDefined();
      expect(controller).toBeDefined();
    });

    it('should validate configuration in async setup', async () => {
      await expect(
        Test.createTestingModule({
          imports: [
            N8nModule.forRootAsync({
              useFactory: () => ({
                baseUrl: '', // Invalid empty baseUrl
                apiKey: 'test-api-key',
                validateConnection: false,
              }),
            }),
          ],
        }).compile()
      ).rejects.toThrow();
    });
  });
});
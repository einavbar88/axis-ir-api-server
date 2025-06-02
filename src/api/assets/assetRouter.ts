import express, { type Router } from 'express';
import { assetController } from './assetController';
import { authMiddleware } from '@/common/middleware/authMiddleware';

export const assetRouter: Router = express.Router();

assetRouter.get(
  '/getAssetsByCompanyId/:companyId',
  authMiddleware,
  assetController.getAssetsByCompanyId,
);

assetRouter.get(
  '/getAssetsByAssetGroup/:assetGroupId',
  authMiddleware,
  assetController.getAssetsByAssetGroup,
);

assetRouter.get(
  '/getAssetGroups/:companyId',
  authMiddleware,
  assetController.getAssetGroups,
);

assetRouter.get(
  '/getAssetGroup/:assetGroupId',
  authMiddleware,
  assetController.getAssetGroup,
);

assetRouter.get('/getIoc/:assetId', authMiddleware, assetController.getIoc);

assetRouter.get('/getIoc/:assetId', authMiddleware, assetController.getIoc);

assetRouter.get('/getById/:id', authMiddleware, assetController.getAssetById);

assetRouter.post('/create', authMiddleware, assetController.createAsset);

assetRouter.post('/update', authMiddleware, assetController.updateAsset);

assetRouter.post(
  '/createAssetGroup',
  authMiddleware,
  assetController.createAssetGroup,
);

assetRouter.post(
  '/assignAssetToGroup',
  authMiddleware,
  assetController.assignToAssetGroup,
);

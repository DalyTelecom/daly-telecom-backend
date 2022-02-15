import { Body, Controller, Get, Post, Put, Delete, Param, HttpCode, HttpStatus, NotFoundException, UsePipes, ValidationPipe, UseGuards, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindManyOptions, FindOperator, Like, Repository } from 'typeorm';
import { AbonentBodyDto, Success, CreatedAbonentID, AbonentList, AbonentEntity, LoginBodyDto, PaginationQuery, FlatAbonentList, FlatAbonentListResponseSchema, FlatAbonent, FlatAbonentResponseSchema, LightAbonentList, FlatLightAbonentList } from './models';
import { ApiOperation, ApiTags, ApiOkResponse, ApiParam, ApiBasicAuth } from '@nestjs/swagger';
import { BasicAuthGuard } from './basic_auth.guard';


@UsePipes(new ValidationPipe({whitelist: true, forbidNonWhitelisted: true, forbidUnknownValues: true, transform: true}))
@Controller('api/v2')
@ApiTags('Операции с абонентами')
export class TelecomControllerV2
{
   constructor(
      @InjectRepository(AbonentEntity)
      private readonly _abonentRepository: Repository<AbonentEntity>,
      private readonly _authService: BasicAuthGuard,
   ) {}

   @Post('login')
   @HttpCode(HttpStatus.OK)
   @ApiOperation({summary: 'Авторизация инженера компании'})
   @ApiOkResponse({type: Success})
   public async login(@Body() body: LoginBodyDto): Promise<Success>
   {
      const success = await this._authService.checkEngineerAuthorization(body.login, body.password);
      return {success};
   }


   @Get('abonents')
   @UseGuards(BasicAuthGuard)
   @ApiBasicAuth()
   @ApiOperation({summary: 'Получение списка абонентов'})
   @ApiOkResponse({type: AbonentList})
   public async getAbonentsList(@Query() query: PaginationQuery): Promise<AbonentList>
   {
      const condition = this._generatFindCondition(query);
      const [abonents, total] = await this._abonentRepository.findAndCount(condition);
      const totalPages = Math.ceil(total / query.pageSize);
      const data = { abonents, total, totalPages, pageSize: query.pageSize, pageNumber: query.pageNumber };
      return data;
   }

   @Get('abonents/:abonentId')
   @UseGuards(BasicAuthGuard)
   @ApiBasicAuth()
   @ApiParam({name: 'abonentId', type: 'integer'})
   @ApiOperation({summary: 'Получение данных абонента по идентификатору'})
   @ApiOkResponse({type: AbonentEntity})
   public async getAbonent(@Param('abonentId') abonentId: string): Promise<AbonentEntity>
   {
      const abonentIdNum = Number(abonentId);
      if (!abonentIdNum) {
         throw new NotFoundException();
      }

      const abonent = await this._abonentRepository.findOne({ where: {id: abonentIdNum}});
      if (abonent === undefined) {
         throw new NotFoundException();
      }

      return abonent;
   }

   @Get('light-abonents')
   @UseGuards(BasicAuthGuard)
   @ApiBasicAuth()
   @ApiOperation({summary: 'Получение списка абонентов (сокращённая информация для отображения списка)'})
   @ApiOkResponse({type: AbonentList})
   public async getLightAbonentsList(@Query() query: PaginationQuery): Promise<LightAbonentList>
   {
      const condition = this._generatFindCondition(query);
      const [abonents, total] = await this._abonentRepository.findAndCount({
         ...condition,
         select: ['id', 'name', 'phone', 'address'],
      });
      const totalPages = Math.ceil(total / query.pageSize);
      const data = { abonents, total, totalPages, pageSize: query.pageSize, pageNumber: query.pageNumber };
      return data;
   }

   @Get('light-flat-abonents')
   @UseGuards(BasicAuthGuard)
   @ApiBasicAuth()
   @ApiOperation({summary: 'Получение списка абонентов (сокращённая информация для отображения списка; компактное представление)'})
   @ApiOkResponse(FlatAbonentListResponseSchema)
   public async getLightFlatAbonentsList(@Query() query: PaginationQuery): Promise<FlatLightAbonentList>
   {
      const list = await this.getLightAbonentsList(query);
      return new FlatLightAbonentList(list);
   }

   @Get('flat-abonents')
   @UseGuards(BasicAuthGuard)
   @ApiBasicAuth()
   @ApiOperation({summary: 'Получение списка абонентов (компактное представление)'})
   @ApiOkResponse(FlatAbonentListResponseSchema)
   public async getFlatAbonentsList(@Query() query: PaginationQuery): Promise<FlatAbonentList>
   {
      const list = await this.getAbonentsList(query);
      return new FlatAbonentList(list);
   }

   @Get('flat-abonents/:abonentId')
   @UseGuards(BasicAuthGuard)
   @ApiBasicAuth()
   @ApiParam({name: 'abonentId', type: 'integer'})
   @ApiOperation({summary: 'Получение данных абонента по идентификатору (компактное представление)'})
   @ApiOkResponse(FlatAbonentResponseSchema)
   public async getFlatAbonent(@Param('abonentId') abonentId: string): Promise<FlatAbonent>
   {
      const abonent = await this.getAbonent(abonentId);
      return new FlatAbonent(abonent);
   }

   @Post('abonents')
   @HttpCode(HttpStatus.OK)
   @UseGuards(BasicAuthGuard)
   @ApiBasicAuth()
   @ApiOperation({summary: 'Создание нового абонента'})
   @ApiOkResponse({type: CreatedAbonentID})
   public async addNewAbonent(@Body() body: AbonentBodyDto): Promise<CreatedAbonentID>
   {
      const abonentEntity = this._abonentRepository.create(body);
      const savedAbonent = await this._abonentRepository.save(abonentEntity);
      return {id: savedAbonent.id};
   }

   @Put('abonents/:abonentId')
   @UseGuards(BasicAuthGuard)
   @ApiBasicAuth()
   @ApiParam({name: 'abonentId', type: 'integer'})
   @ApiOperation({summary: 'Обновление данных абонента'})
   @ApiOkResponse({type: Success})
   public async updateAbonent(@Param('abonentId') abonentId: string, @Body() body: AbonentBodyDto): Promise<Success>
   {
      const abonentIdNum = Number(abonentId);
      if (!abonentIdNum) {
         throw new NotFoundException();
      }

      const updateObject: DeepPartial<AbonentEntity> = {};
      Object.keys(body).forEach((key) => {
         // @ts-ignore
         updateObject[key] = body[key] || null;
      });

      const result = await this._abonentRepository.update({id: abonentIdNum}, updateObject);

      if (result.affected !== 1) {
         throw new NotFoundException();
      }

      return {success: true};
   }

   @Delete('abonents/:abonentId')
   @UseGuards(BasicAuthGuard)
   @ApiBasicAuth()
   @ApiParam({name: 'abonentId', type: 'integer'})
   @ApiOperation({summary: 'Удаление абонента'})
   @ApiOkResponse({type: Success})
   public async deleteAbonent(@Param('abonentId') abonentId: string): Promise<Success>
   {
      const abonentIdNum = Number(abonentId);
      if (!abonentIdNum) {
         throw new NotFoundException();
      }

      const result = await this._abonentRepository.delete({id: abonentIdNum});

      if (result.affected !== 1) {
         throw new NotFoundException();
      }

      return {success: true};
   }


   private _generatFindCondition({pageSize, pageNumber, name, phone, address}: PaginationQuery): FindManyOptions<AbonentEntity>
   {
      const where: {name?: FindOperator<string>, phone?: FindOperator<string>, address?: FindOperator<string>} = {};
      if (name) {
         where.name = Like(`%${name}%`);
      }
      if (phone) {
         where.phone = Like(`%${phone}%`);
      }
      if (address) {
         where.address = Like(`%${address}%`);
      }

      const condition: FindManyOptions<AbonentEntity> = {
         where,
         skip: pageSize * (pageNumber - 1),
         take: pageSize,
      };

      return condition;
   }
}

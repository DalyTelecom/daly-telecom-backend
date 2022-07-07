import { Body, Controller, Get, Post, Put, Delete, Param, HttpCode, HttpStatus, NotFoundException, UsePipes, ValidationPipe } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AbonentBodyDto, Success, CreatedAbonentID, UserList, AbonentEntity } from './models';
import { ApiOperation, ApiTags, ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';


@UsePipes(new ValidationPipe())
@Controller(['api', 'api/v1'])
@ApiTags('Операции над пользователями')
export class TelecomControllerV1
{
   constructor(
      @InjectRepository(AbonentEntity)
      private readonly _userRepository: Repository<AbonentEntity>,
   ) {}


   @Get('users')
   @ApiOperation({summary: 'Получение списка пользователей', deprecated: true})
   @ApiOkResponse({type: UserList})
   public async getUsersList(): Promise<UserList>
   {
      const users = await this._userRepository.find();
      return { users };
   }

   @Get('users/:userId')
   @ApiParam({name: 'userId', type: 'integer'})
   @ApiOperation({summary: 'Получение данных пользователя по идентификатору', deprecated: true})
   @ApiOkResponse({type: AbonentEntity})
   public async getUser(@Param('userId') userId: string): Promise<AbonentEntity>
   {
      const userIdNum = Number(userId);
      if (!userIdNum) {
         throw new NotFoundException();
      }

      const user = await this._userRepository.findOne({ where: {id: userIdNum}});
      if (user === null) {
         throw new NotFoundException();
      }

      return user;
   }

   @Post('users')
   @HttpCode(HttpStatus.OK)
   @ApiOperation({summary: 'Создание нового пользователя', deprecated: true})
   @ApiOkResponse({type: CreatedAbonentID})
   public async register(@Body() body: AbonentBodyDto): Promise<CreatedAbonentID>
   {
      const userEntity = this._userRepository.create(body);
      const savedUser = await this._userRepository.save(userEntity);
      return {id: savedUser.id};
   }

   @Put('users/:userId')
   @ApiParam({name: 'userId', type: 'integer'})
   @ApiOperation({summary: 'Обновление данных пользователя', deprecated: true})
   @ApiOkResponse({type: Success})
   public async updateUser(@Param('userId') userId: string, @Body() body: AbonentBodyDto): Promise<Success>
   {
      const userIdNum = Number(userId);
      if (!userIdNum) {
         throw new NotFoundException();
      }

      const updateObject: QueryDeepPartialEntity<AbonentEntity> = {};
      Object.keys(body).forEach((key) => {
         // @ts-ignore
         updateObject[key] = body[key] || null;
      });

      const result = await this._userRepository.update({id: userIdNum}, updateObject);

      if (result.affected !== 1) {
         throw new NotFoundException();
      }

      return {success: true};
   }

   @Delete('users/:userId')
   @ApiParam({name: 'userId', type: 'integer'})
   @ApiOperation({summary: 'Удаление пользователя', deprecated: true})
   @ApiOkResponse({type: Success})
   public async deleteUser(@Param('userId') userId: string): Promise<Success>
   {
      const userIdNum = Number(userId);
      if (!userIdNum) {
         throw new NotFoundException();
      }

      const result = await this._userRepository.delete({id: userIdNum});

      if (result.affected !== 1) {
         throw new NotFoundException();
      }

      return {success: true};
   }
}

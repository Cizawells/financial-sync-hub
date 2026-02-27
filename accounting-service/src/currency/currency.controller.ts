import { Controller, Get } from "@nestjs/common";

@Controller('/currencies')
export class CurrencyController {

    @Get()
    findAll() {

    }
}
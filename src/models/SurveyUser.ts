import { 
  Entity, 
  PrimaryColumn, 
  Column, 
  CreateDateColumn, 
  ManyToOne, 
  JoinColumn 
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import { User } from './user';
import { Survey } from './Survey';

@Entity("survey_users")
class SurveyUser {
  @PrimaryColumn()
  readonly id: string;

  @ManyToOne(() => User)
  @JoinColumn({name: 'user_id'})
  user: User;

  @ManyToOne(() => Survey)
  @JoinColumn({name: 'survey_id'})
  survey: Survey;

  @Column()
  user_id: string;

  @Column()
  survey_id: string;

  @Column()
  value: number;
  
  @CreateDateColumn()
  created_at: Date;

  constructor(){
    if(!this.id){
      this.id = uuid();
    }
  }
}

export { SurveyUser }